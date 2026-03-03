"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as cheerio from "cheerio";
import { generateTextWithFallback, isLlmConfigured, analyzeImageUrl } from "@/lib/ai/llm";

// ─── Types ──────────────────────────────────────────────────────────

export interface SpotInput {
    url: string;
    content?: string; // User-provided post text / caption
    screenshot_b64?: string; // Optional screenshot payload (for OCR/visual hints)
    video_analysis?: string; // Optional external video analysis text
}

export interface ExtractedSpot {
    spot_id: string;
    name: string;
    address: string;
    description: string;
    tips: string;
    category: string;
    latlng: [number, number] | null;
    maps_url: string;
    confidence: number;
    source_evidence: string;
}

export interface ImporterResult {
    success: boolean;
    platform: "instagram" | "tiktok" | "youtube_shorts" | "unknown";
    spots: ExtractedSpot[];
    reason?: string;
    error?: string;
    metadata?: {
        post_title?: string;
        author?: string;
        thumbnail?: string;
    };
}

// ─── Platform Identification ────────────────────────────────────────

function identifyPlatform(url: string): ImporterResult["platform"] {
    const lower = url.toLowerCase();
    if (lower.includes("instagram.com")) return "instagram";
    if (lower.includes("tiktok.com") || lower.includes("vm.tiktok.com") || lower.includes("vt.tiktok.com")) return "tiktok";
    if (lower.includes("youtube.com/shorts") || lower.includes("youtu.be")) return "youtube_shorts";
    return "unknown";
}

/** Detect if link is to a specific post/reel or to a profile page. */
function getSocialLinkType(url: string, platform: ImporterResult["platform"]): "post" | "profile" | "unknown" {
    try {
        const parsed = new URL(url);
        const path = parsed.pathname.replace(/\/$/, ""); // trim trailing slash
        const segments = path.split("/").filter(Boolean);

        if (platform === "instagram") {
            // Post: /p/SHORTCODE or /reel/SHORTCODE
            if (segments[0] === "p" && segments.length >= 2) return "post";
            if (segments[0] === "reel" && segments.length >= 2) return "post";
            // Profile: /username only (single segment, no "p" or "reel")
            if (segments.length === 1) return "profile";
            return "unknown";
        }

        if (platform === "tiktok") {
            // Short links vt.tiktok.com/xxx or vm.tiktok.com/xxx → video
            if (parsed.hostname.includes("vt.tiktok.com") || parsed.hostname.includes("vm.tiktok.com"))
                return "post";
            // tiktok.com/@user/video/123 → post
            if (segments.includes("video")) return "post";
            // tiktok.com/@username only → profile
            if (segments.length === 1 && segments[0].startsWith("@")) return "profile";
            if (segments.length <= 1) return "profile";
            return "post"; // other tiktok.com paths assume video
        }

        return "unknown";
    } catch {
        return "unknown";
    }
}

// ─── Helpers ────────────────────────────────────────────────────────

function generateSpotId(name: string, index: number): string {
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "")
        .substring(0, 30);
    return `spot_${slug}_${index}_${Date.now().toString(36)}`;
}

function buildMapsUrl(latlng: [number, number] | null, name: string, address?: string): string {
    if (latlng && latlng[0] !== 0 && latlng[1] !== 0) {
        return `https://maps.google.com/?q=${latlng[0]},${latlng[1]}`;
    }
    const query = [name, address].filter(Boolean).join(", ");
    return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}

type ParsedAiResponse = {
    spots: Array<{
        name?: string;
        address?: string;
        description?: string;
        tips?: string;
        category?: string;
        latlng?: [number, number] | null;
        confidence?: number;
        source_evidence?: string;
    }>;
    post_title?: string | null;
    author?: string | null;
    reason?: string | null;
};

function isRateLimitError(error: any): boolean {
    const status = Number(error?.status || error?.code || error?.cause?.status || 0);
    if (status === 429) return true;
    const message = String(error?.message || "").toLowerCase();
    return message.includes("429") || message.includes("too many requests") || message.includes("rate limit");
}

function parseAiResponse(text: string): ParsedAiResponse {
    let jsonStr = text.trim();

    if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    }

    jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

    try {
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed)) {
            return { spots: parsed, reason: null };
        }
        if (parsed && typeof parsed === "object") {
            return {
                spots: Array.isArray(parsed.spots) ? parsed.spots : [],
                reason: parsed.reason ?? null,
                post_title: parsed.post_title ?? null,
                author: parsed.author ?? null,
            };
        }
    } catch {
        // fall through to extraction attempts
    }

    const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objectMatch) {
        const parsed = JSON.parse(objectMatch[0].replace(/,(\s*[}\]])/g, "$1"));
        return {
            spots: Array.isArray(parsed.spots) ? parsed.spots : [],
            reason: parsed.reason ?? null,
            post_title: parsed.post_title ?? null,
            author: parsed.author ?? null,
        };
    }

    const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
        const parsed = JSON.parse(arrayMatch[0].replace(/,(\s*])/g, "$1"));
        return { spots: Array.isArray(parsed) ? parsed : [], reason: null };
    }

    throw new Error("Invalid AI JSON response");
}

const FETCH_TIMEOUT_MS = 8000;

function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timeout));
}

async function resolveShortUrl(url: string): Promise<string> {
    try {
        const res = await fetchWithTimeout(url, {
            method: "HEAD",
            redirect: "follow",
            headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
        });
        return res.url || url;
    } catch {
        try {
            const res = await fetchWithTimeout(url, {
                redirect: "follow",
                headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
            });
            return res.url || url;
        } catch {
            return url;
        }
    }
}

const VISION_PROMPT = `Analyze this image from a social media travel post. Describe in detail:
1. Any visible place names, signs, text (in any language — transliterate and translate)
2. Type of place (restaurant, cafe, temple, viewpoint, market, etc.)
3. Location clues (city, country, neighborhood, landmarks)
4. What activity is shown (eating, sightseeing, shopping, etc.)
5. Any prices, menus, or practical details visible

Be specific. If you see Japanese/Korean/Chinese text on signs, transliterate it AND translate it.
Format: a concise paragraph, max 200 words.`;

async function analyzePostThumbnail(thumbnailUrl: string | string[], platform: string): Promise<string> {
    if (!thumbnailUrl || (Array.isArray(thumbnailUrl) && thumbnailUrl.length === 0)) return "";
    try {

        const description = await analyzeImageUrl(thumbnailUrl, VISION_PROMPT);

        const typeStr = Array.isArray(thumbnailUrl) ? `gallery of ${thumbnailUrl.length} images` : "image/video";
        return `Visual analysis of post ${typeStr}: ${description}`;
    } catch (e) {
        console.warn(`[SpotImporter] Vision analysis failed:`, e instanceof Error ? e.message : e);
        return "";
    }
}

function normalizeTikTokUrlForOEmbed(url: string): string {
    // oEmbed returns 400 for /photo/ URLs — replace with /video/ (same content ID)
    return url.replace(/\/@([^/]+)\/photo\//, "/@$1/video/");
}

async function fetchTikTokContent(url: string, originalUrl: string): Promise<string> {
    const parts: string[] = [];
    let images: string[] = [];

    // 1. First try TikWM API which provides full gallery data for photo carousels
    try {
        const tikwmUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
        const tikwmRes = await fetchWithTimeout(tikwmUrl);
        if (tikwmRes.ok) {
            const tikwmData = await tikwmRes.json();
            if (tikwmData.code === 0 && tikwmData.data) {
                const data = tikwmData.data;
                if (data.title) parts.push(`Post caption: ${data.title}`);
                if (data.author && data.author.unique_id) parts.push(`Author: @${data.author.unique_id}`);

                if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                    images = data.images;
                } else if (data.cover) {
                    images = [data.cover];
                }

                if (parts.length > 0 || images.length > 0) {

                }
            }
        }
    } catch (e) {
        console.warn(`[SpotImporter] TikTok TikWM failed:`, e instanceof Error ? e.message : e);
    }

    // 2. If TikWM failed, fallback to oEmbed
    if (parts.length === 0 && images.length === 0) {
        const candidates = [
            originalUrl,
            normalizeTikTokUrlForOEmbed(url),
            url,
        ].filter(Boolean);
        const uniqueCandidates = [...new Set(candidates)];

        for (const tryUrl of uniqueCandidates) {
            try {
                const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(tryUrl)}`;
                const res = await fetchWithTimeout(oembedUrl);
                if (!res.ok) continue;
                const data = await res.json();
                if (data.title) parts.push(`Post caption: ${data.title}`);
                if (data.author_name) parts.push(`Author: @${data.author_name}`);
                if (data.thumbnail_url) images = [data.thumbnail_url];
                if (parts.length > 0) {

                    break;
                }
            } catch {
                continue;
            }
        }
    }

    // 3. Always use vision AI to analyze the thumbnail(s) to avoid losing content
    if (images.length > 0) {
        // Limit to first 10 images to allow for larger photo carousels without exceeding payload limits
        const imagesToAnalyze = images.slice(0, 10);
        const visionResult = await analyzePostThumbnail(imagesToAnalyze.length === 1 ? imagesToAnalyze[0] : imagesToAnalyze, "tiktok");
        if (visionResult) parts.push(visionResult);
    }

    return parts.join("\n");
}

function extractInstagramShortcode(url: string): string | null {
    const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
}

async function fetchInstagramContent(url: string): Promise<string> {
    const shortcode = extractInstagramShortcode(url);
    if (!shortcode) return "";

    const parts: string[] = [];
    let thumbnailUrl = "";

    // 1. Try embed/captioned endpoint
    try {
        const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
        const res = await fetchWithTimeout(embedUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });
        if (res.ok) {
            const html = await res.text();
            const $ = cheerio.load(html);

            const caption =
                $(".Caption").text().trim() ||
                $('[class*="caption"]').text().trim() ||
                $('[class*="Caption"]').text().trim() ||
                "";
            const author =
                $(".UsernameText").text().trim() ||
                $('[class*="username"]').first().text().trim() ||
                "";

            if (caption) parts.push(`Post caption: ${caption}`);
            if (author) parts.push(`Author: @${author}`);

            if (!caption) {
                const ogDesc = $('meta[property="og:description"]').attr("content") || "";
                if (ogDesc) parts.push(`Post description: ${ogDesc}`);
            }

            thumbnailUrl =
                $('meta[property="og:image"]').attr("content") ||
                $("img.EmbeddedMediaImage").attr("src") ||
                "";

            if (parts.length > 0) {

            }
        }
    } catch (e) {
        console.warn(`[SpotImporter] Instagram embed failed:`, e instanceof Error ? e.message : e);
    }

    // 2. Fallback: Googlebot UA for OG tags
    if (parts.length === 0) {
        try {
            const res = await fetchWithTimeout(url, {
                redirect: "follow",
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
                    "Accept-Language": "en-US,en;q=0.9",
                },
            });
            if (res.ok) {
                const html = await res.text();
                const $ = cheerio.load(html);

                const ogTitle = $('meta[property="og:title"]').attr("content") || "";
                const ogDesc = $('meta[property="og:description"]').attr("content") || "";
                const ogImage = $('meta[property="og:image"]').attr("content") || "";

                if (ogTitle && !ogTitle.includes("Instagram")) parts.push(`Title: ${ogTitle}`);
                if (ogDesc && ogDesc.length > 20) parts.push(`Description: ${ogDesc}`);
                if (ogImage && !thumbnailUrl) thumbnailUrl = ogImage;
            }
        } catch {
            // silent
        }
    }

    // 3. Always analyze the thumbnail image with vision AI to avoid losing content
    if (thumbnailUrl) {
        const visionResult = await analyzePostThumbnail(thumbnailUrl, "instagram");
        if (visionResult) parts.push(visionResult);
    }

    return parts.join("\n");
}

async function fetchYouTubeContent(url: string): Promise<string> {
    const parts: string[] = [];
    let thumbnailUrl = "";

    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const res = await fetchWithTimeout(oembedUrl);
        if (res.ok) {
            const data = await res.json();
            if (data.title) parts.push(`Video title: ${data.title}`);
            if (data.author_name) parts.push(`Author: ${data.author_name}`);
            if (data.thumbnail_url) thumbnailUrl = data.thumbnail_url;
        }
    } catch {
        // silent
    }

    if (thumbnailUrl) {
        const visionResult = await analyzePostThumbnail(thumbnailUrl, "youtube");
        if (visionResult) parts.push(visionResult);
    }

    return parts.join("\n");
}

async function fetchPostContent(url: string, platform: string, originalUrl: string): Promise<string> {
    switch (platform) {
        case "instagram": return fetchInstagramContent(url);
        case "tiktok": return fetchTikTokContent(url, originalUrl);
        case "youtube_shorts": return fetchYouTubeContent(url);
        default: return "";
    }
}

// ─── Main Import Logic ──────────────────────────────────────────────

export async function importSocialSpots(input: SpotInput): Promise<ImporterResult> {
    const { url, content, screenshot_b64, video_analysis } = input;

    if (!url) {
        return { success: false, platform: "unknown", spots: [], error: "URL is required" };
    }

    if (!isLlmConfigured()) {
        return { success: false, platform: "unknown", spots: [], error: "AI API key not configured (Groq/OpenRouter)" };
    }


    const resolvedUrl = await resolveShortUrl(url);


    const platform = identifyPlatform(resolvedUrl);


    const linkType = getSocialLinkType(resolvedUrl, platform);
    if (platform === "instagram" && linkType === "profile") {
        return {
            success: false,
            platform,
            spots: [],
            error: "This is a profile link. Paste a link to a specific post or reel to extract spots.",
        };
    }
    if (platform === "tiktok" && linkType === "profile") {
        return {
            success: false,
            platform,
            spots: [],
            error: "This is a profile link. Paste a link to a specific TikTok video to extract spots.",
        };
    }

    // Auto-fetch post content from platform-specific sources (pass original URL for oEmbed fallback)
    const postContent = await fetchPostContent(resolvedUrl, platform, url);

    // Combine: auto-fetched content + optional user-provided content
    const extraContext = [postContent, content, video_analysis].filter(Boolean).join("\n---\n");


    // Normalize URL for stable processing (strip tracking params and fragment)
    let normalizedUrl = resolvedUrl;
    try {
        const u = new URL(resolvedUrl);
        u.searchParams.delete("utm_source");
        u.searchParams.delete("utm_medium");
        u.searchParams.delete("utm_campaign");
        u.searchParams.delete("igsh");
        u.hash = "";
        normalizedUrl = u.toString();
    } catch {
        normalizedUrl = resolvedUrl;
    }

    const hasContext = extraContext.length > 10;

    const prompt = `You are TRIPWEAVE SOCIAL SPOT IMPORTER AGENT.
IMPORTANT: You have NO internet access. You can ONLY use the information provided below.

URL: ${normalizedUrl}
Platform: ${platform}

=== POST CONTENT (extracted from the URL) ===
${extraContext || "(Could not extract any content from the URL)"}
=== END POST CONTENT ===

YOUR TASK:
Extract ALL travel-related spots (restaurants, cafes, bars, museums, parks, viewpoints, markets, temples, hotels, attractions, etc.) from the post content above.

${hasContext ? `The post content above was scraped from the URL. Analyze it thoroughly — look for:
- Named places (restaurants, cafes, landmarks, hotels, etc.)
- Addresses or location hints (city names, neighborhoods, districts)
- Activity mentions (ramen spot, hidden cafe, rooftop bar, etc.)
- Even if the caption is in Russian/Japanese/Korean, extract the place names and translate to English.
- If the author username hints at a location (e.g. "tokyo_food"), use that as a location clue.` : `Could not extract content from the URL automatically. Return empty spots with reason "Unable to fetch post content. Try pasting the post caption manually."`}

RULES:
1) Extract 1-7 spots. Even a SINGLE mentioned place counts.
2) VERY IMPORTANT: If the same location is mentioned in both the text caption and the visual analysis, MERGE all details into a SINGLE spot item. Do NOT create duplicate spots for the same place.
3) For each spot: name, address (city + country minimum), description, tips, category, latlng, confidence, source_evidence.
4) Categories must be ONE of the following (choose the most matching): "Food", "Nature", "Culture", "Must See", "Other".
5) Provide latlng coordinates from your knowledge of real places.
6) Output in English only (translate from any language).
7) confidence: 0.0-1.0 based on how certain you are about the identification.

OUTPUT FORMAT (strict JSON, no markdown fences):
{
  "spots": [
    {
      "name": "Place Name",
      "address": "Full address, City, Country",
      "description": "What makes this place special (1-2 sentences).",
      "tips": "Price, hours, booking info if known.",
      "category": "Food",
      "latlng": [35.6523, 139.7967],
      "confidence": 0.9,
      "source_evidence": "Why you identified this from the content."
    }
  ],
  "post_title": "Short title or null",
  "author": "Author username or null",
  "reason": null
}

If truly no places found:
{ "spots": [], "post_title": null, "author": null, "reason": "explanation" }`;

    try {

        const text = await generateTextWithFallback(prompt, {
            systemPrompt: "You are a strict JSON data extraction assistant. Return ONLY valid JSON.",
            temperature: 0.2,
        });


        let aiResult: ParsedAiResponse;
        try {
            aiResult = parseAiResponse(text);
        } catch {
            console.error(`[SpotImporter] JSON parse failed. Raw text: ${text.substring(0, 300)}`);
            return {
                success: false,
                platform,
                spots: [],
                error: "AI returned an invalid response. Please retry.",
            };
        }

        // Ensure spots is an array
        if (!Array.isArray(aiResult.spots)) {
            aiResult.spots = [];
        }



        if (aiResult.spots.length === 0) {
            return {
                success: true,
                platform,
                spots: [],
                reason: aiResult.reason || "No travel spots detected in this post",
                metadata: {
                    post_title: aiResult.post_title || undefined,
                    author: aiResult.author || undefined,
                },
            };
        }

        // Build ExtractedSpot[] with generated IDs and maps URLs
        const spots: ExtractedSpot[] = aiResult.spots.map((s, index) => ({
            spot_id: generateSpotId(s.name || `spot_${index}`, index),
            name: s.name || "Unknown Place",
            address: s.address || "",
            description: s.description || "",
            tips: s.tips || "",
            category: s.category || "other",
            latlng: s.latlng && Array.isArray(s.latlng) && s.latlng.length === 2 ? s.latlng : null,
            maps_url: buildMapsUrl(
                s.latlng && Array.isArray(s.latlng) && s.latlng.length === 2 ? s.latlng : null,
                s.name || "",
                s.address
            ),
            confidence: typeof s.confidence === "number" ? s.confidence : 0.5,
            source_evidence: s.source_evidence || "",
        }));

        return {
            success: true,
            platform,
            spots,
            metadata: {
                post_title: aiResult.post_title || undefined,
                author: aiResult.author || undefined,
            },
        };
    } catch (aiError: any) {
        console.error(`[SpotImporter] AI error:`, aiError);
        if (isRateLimitError(aiError)) {
            return {
                success: false,
                platform,
                spots: [],
                error: "AI provider is rate-limited right now. Please retry in 10-20 seconds.",
            };
        }
        const aiMessage = String(aiError?.message || "");
        if (aiMessage.includes("not found for API version") || aiMessage.includes("is not found")) {
            return {
                success: false,
                platform,
                spots: [],
                error: "AI model configuration error. Please contact support.",
            };
        }
        return {
            success: false,
            platform,
            spots: [],
            error: `AI extraction failed: ${aiError.message}`,
        };
    }
}

// ─── Save Spots to Database ─────────────────────────────────────────

export async function saveSpotAsPlace(spot: ExtractedSpot, sourceUrl: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });

    if (!user) {
        return { success: false, error: "User not found" };
    }

    try {
        const place = await prisma.place.create({
            data: {
                name: spot.name,
                description: [spot.description, spot.tips ? `💡 ${spot.tips}` : ""].filter(Boolean).join("\n"),
                image: null,
                url: sourceUrl,
                location: spot.address || null,
                source: spot.category || "SOCIAL_IMPORT",
                userId: user.id,
            },
        });

        revalidatePath("/explore");
        return { success: true, place };
    } catch (error: any) {
        console.error("Failed to save spot:", error);
        return { success: false, error: "Failed to save spot" };
    }
}

export async function saveAllSpotsAsPlaces(spots: ExtractedSpot[], sourceUrl: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });

    if (!user) {
        return { success: false, error: "User not found" };
    }

    try {
        const createdPlaces = await Promise.all(
            spots.map(spot =>
                prisma.place.create({
                    data: {
                        name: spot.name,
                        description: [spot.description, spot.tips ? `💡 ${spot.tips}` : ""].filter(Boolean).join("\n"),
                        image: null,
                        url: sourceUrl,
                        location: spot.address || null,
                        source: spot.category || "SOCIAL_IMPORT",
                        userId: user.id,
                    },
                })
            )
        );

        revalidatePath("/explore");
        return { success: true, places: createdPlaces };
    } catch (error: any) {
        console.error("Failed to save spots:", error);
        return { success: false, error: "Failed to save spots" };
    }
}

export async function addSpotToTrip(spot: ExtractedSpot, tripId: string) {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });

    if (!user) {
        return { success: false, error: "User not found" };
    }

    try {
        let eventType = "ACTIVITY";
        const cat = spot.category.toLowerCase();
        if (["restaurant", "cafe", "bar", "food", "market"].includes(cat)) eventType = "RESTAURANT";
        if (["hotel", "hostel"].includes(cat)) eventType = "HOTEL";
        if (["transport"].includes(cat)) eventType = "TRANSPORT";

        const event = await prisma.event.create({
            data: {
                tripId,
                title: spot.name,
                description: [spot.description, spot.tips ? `💡 ${spot.tips}` : ""].filter(Boolean).join("\n"),
                type: eventType as any,
                startTime: new Date(),
                endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
                location: spot.address || spot.name,
                lat: spot.latlng?.[0] ?? null,
                lng: spot.latlng?.[1] ?? null,
                url: spot.maps_url,
                createdBy: user.id,
            },
        });

        revalidatePath(`/trip/${tripId}`);
        return { success: true, event };
    } catch (error: any) {
        console.error("Failed to add spot to trip:", error);
        return { success: false, error: "Failed to add to trip" };
    }
}
