"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as cheerio from "cheerio";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const COMPLEX_SITES = [
    'instagram.com',
    'tiktok.com',
    'youtube.com/shorts',
    'facebook.com',
    't.me',
    'google.com/maps',
    'goo.gl',
];

export interface ParsedLink {
    title: string;
    description: string;
    image: string;
    url: string;
    address?: string;
}

// Fetch post caption/metadata via oEmbed APIs (free, no auth needed for TikTok)
async function fetchOEmbed(url: string): Promise<{ caption: string; authorName: string; thumbnailUrl: string } | null> {
    const lowerUrl = url.toLowerCase();

    try {
        // TikTok oEmbed
        if (lowerUrl.includes("tiktok.com")) {
            const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
            const res = await fetch(oembedUrl);
            if (res.ok) {
                const data = await res.json();
                console.log(`[oEmbed] TikTok raw response keys: ${Object.keys(data).join(", ")}`);
                return {
                    caption: data.title || "",
                    authorName: data.author_name || "",
                    thumbnailUrl: data.thumbnail_url || "",
                };
            }
        }

        // Instagram oEmbed (may require token in production, but basic endpoint often works)
        if (lowerUrl.includes("instagram.com")) {
            const oembedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}&omitscript=true`;
            const res = await fetch(oembedUrl);
            if (res.ok) {
                const data = await res.json();
                console.log(`[oEmbed] Instagram raw response keys: ${Object.keys(data).join(", ")}`);
                return {
                    caption: data.title || "",
                    authorName: data.author_name || "",
                    thumbnailUrl: data.thumbnail_url || "",
                };
            }
        }

        // YouTube Shorts oEmbed
        if (lowerUrl.includes("youtube.com/shorts")) {
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const res = await fetch(oembedUrl);
            if (res.ok) {
                const data = await res.json();
                console.log(`[oEmbed] YouTube raw response keys: ${Object.keys(data).join(", ")}`);
                return {
                    caption: data.title || "",
                    authorName: data.author_name || "",
                    thumbnailUrl: data.thumbnail_url || "",
                };
            }
        }
    } catch (e: any) {
        console.error(`[oEmbed] Error: ${e.message}`);
    }

    return null;
}

export async function parseLink(
    url: string,
    forceAi: boolean = false,
    userContext?: string
): Promise<{ success: boolean; data?: ParsedLink; error?: string; isAiUsed?: boolean; isSocialMedia?: boolean }> {
    try {
        // Basic validation
        if (!url) return { success: false, error: "URL is required" };
        if (!url.startsWith("http")) {
            url = `https://${url}`;
        }

        const isSocialMedia = COMPLEX_SITES.some(site => url.toLowerCase().includes(site));
        const shouldUseAi = isSocialMedia || forceAi;
        console.log(`[Parser] Starting parse for: ${url} (isSocialMedia: ${isSocialMedia}, shouldUseAi: ${shouldUseAi})`);

        let title = "";
        let description = "";
        let image = "";
        let htmlSource = "";
        let oEmbedCaption = "";

        // Step 1: Try oEmbed for social media (auto-extract caption)
        if (isSocialMedia) {
            try {
                const oEmbedData = await fetchOEmbed(url);
                if (oEmbedData) {
                    oEmbedCaption = oEmbedData.caption || "";
                    title = oEmbedData.authorName || "";
                    image = oEmbedData.thumbnailUrl || "";
                    console.log(`[Parser] oEmbed success:`, { caption: oEmbedCaption.substring(0, 80) + "...", author: title, image: !!image });
                }
            } catch (e: any) {
                console.error(`[Parser] oEmbed failed: ${e.message}`);
            }
        }

        // Step 2: Standard HTML fetch (for non-social or as enrichment)
        let resolvedUrl = url;
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
                redirect: 'follow',
                next: { revalidate: 3600 }
            });

            resolvedUrl = response.url; // Capture final URL after redirects (e.g. goo.gl -> google.com/maps/place/...)
            console.log(`[Parser] Standard fetch status: ${response.status}, Resolved URL: ${resolvedUrl}`);

            if (response.ok) {
                htmlSource = await response.text();
                const $ = cheerio.load(htmlSource);

                if (!title) {
                    const metaTitle = $('meta[property="og:title"]').attr("content") ||
                        $('meta[name="twitter:title"]').attr("content") ||
                        $("title").text() ||
                        "";

                    // Don't use generic "Google Maps" title if we can avoid it
                    if (metaTitle && !metaTitle.includes("Google Maps")) {
                        title = metaTitle;
                    }
                }

                if (!description) {
                    description =
                        $('meta[property="og:description"]').attr("content") ||
                        $('meta[name="twitter:description"]').attr("content") ||
                        $('meta[name="description"]').attr("content") ||
                        "";
                }

                if (!image) {
                    image =
                        $('meta[property="og:image"]').attr("content") ||
                        $('meta[name="twitter:image"]').attr("content") ||
                        "";
                }

                console.log(`[Parser] HTML metadata:`, { title, description: description.substring(0, 50) + "...", image: !!image });
            }
        } catch (e: any) {
            console.error(`[Parser] Standard fetch failed: ${e.message}`);
        }

        // Step 3: AI-enhanced parsing
        const hasApiKey = !!process.env.GEMINI_API_KEY;
        // Combine all context we have
        const combinedContext = [oEmbedCaption, userContext, description].filter(Boolean).join("\n");
        console.log(`[Parser] AI Check: shouldUseAi=${shouldUseAi}, hasApiKey=${hasApiKey}, contextLength=${combinedContext.length}`);

        if (shouldUseAi && hasApiKey) {
            console.log(`[Parser] Attempting AI enhancement with Gemini...`);
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

                const prompt = `You are an assistant that extracts travel place information from social media posts and map links.

A user found an interesting place on social media or Google Maps and wants to save it for their trip.

Original URL: ${url}
Resolved URL (after redirects): ${resolvedUrl}
Post caption / description:
"${combinedContext}"
${title ? `Page Title found: "${title}"` : ""}

Your task: Find the NAME of the place (restaurant, cafe, bar, hotel, attraction, etc.), its LOCATION, and a short description.

CRITICAL INSTRUCTIONS:
1. For Google Maps links: Look at the "Resolved URL". It often contains the place name (e.g. /maps/place/Eiffel+Tower/...). Extract it!
2. If the Page Title is generic (like "Google Maps"), IGNORE IT and use the URL segments instead.
3. For the ADDRESS field: Be as precise as possible! Include street name, building number, city, and country. If the post mentions a specific address, USE IT exactly. If a Google Maps URL contains coordinates, try to determine the nearest address.
4. For social media posts: Carefully read the ENTIRE caption. Authors often mention exact addresses, neighborhoods, or cross-streets. Look for location tags, hashtags with city names, and any text after emoji like 📍.

You MUST return a valid JSON object with these keys:
{
  "title": "Name of the place",
  "description": "A short, helpful description (1-2 sentences). What is this place and what makes it special?",
  "type": "One of: Restaurant, Cafe, Bar, Hotel, Hostel, Attraction, Museum, Park, Beach, Shopping, Nightlife, Other",
  "address": "PRECISE address: street, number, city, country. Be as specific as possible!"
}

IMPORTANT: Return ONLY the JSON object. No explanations, no markdown, no code fences.`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                console.log(`[Parser] Raw AI Response: ${text}`);

                const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
                const aiData = JSON.parse(jsonStr);

                console.log(`[Parser] Parsed AI Data:`, aiData);

                return {
                    success: true,
                    isAiUsed: true,
                    data: {
                        title: aiData.title || title || "Found via AI",
                        description: aiData.description || description,
                        image: image,
                        url: url,
                        address: aiData.address || "",
                    },
                };
            } catch (aiError: any) {
                console.error(`[Parser] Gemini AI parsing failed: ${aiError.message}`);
            }
        }

        // If social media and AI failed but we still don't have meaningful data, ask user for help
        if (isSocialMedia && !combinedContext && !title) {
            return {
                success: true,
                isSocialMedia: true,
                data: undefined,
            };
        }

        // Return whatever we found (standard)
        return {
            success: true,
            isAiUsed: false,
            data: {
                title: title || "New Link",
                description,
                image,
                url,
            },
        };
    } catch (error: any) {
        console.error("Link parsing error:", error);
        return { success: false, error: "Failed to parse link: " + error.message };
    }
}

export async function savePlace(data: ParsedLink) {
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
                name: data.title,
                description: data.description,
                image: data.image,
                url: data.url,
                source: "LINK_PARSER",
                userId: user.id,
            },
        });

        revalidatePath("/explore");
        return { success: true, place };
    } catch (error: any) {
        console.error("Failed to save place:", error);
        return { success: false, error: "Failed to save place" };
    }
}

export async function getMyPlaces() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser || !authUser.id) {
        return [];
    }

    const user = await prisma.user.findUnique({
        where: { authId: authUser.id },
    });

    if (!user) {
        return [];
    }

    return await prisma.place.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });
}

export async function convertPlaceToEvent(tripId: string, place: { title?: string; name?: string; description?: string | null; image?: string | null; url?: string | null; address?: string | null; location?: string | null; lat?: number | null; lng?: number | null; type?: string }) {
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

    const title = place.title || place.name || "Untitled Place";

    try {
        // Map place types to EventType enum if possible, default to OTHER or ACTIVITY
        let eventType = "ACTIVITY";
        const lowerType = place.type?.toLowerCase() || "";
        if (lowerType.includes("food") || lowerType.includes("restaurant")) eventType = "RESTAURANT";
        if (lowerType.includes("hotel") || lowerType.includes("stay")) eventType = "HOTEL";
        if (lowerType.includes("flight") || lowerType.includes("transport")) eventType = "TRANSPORT";

        const event = await prisma.event.create({
            data: {
                tripId,
                title: title,
                description: place.description || "",
                type: eventType as any,
                startTime: new Date(), // User will need to adjust this
                endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
                location: place.address || place.location || title,
                lat: place.lat,
                lng: place.lng,
                url: place.url,
                coverImage: place.image,
                createdBy: user.id,
            },
        });

        revalidatePath(`/trip/${tripId}`);
        return { success: true, event };
    } catch (error: any) {
        console.error("Failed to convert place to event:", error);
        return { success: false, error: "Failed to add to trip" };
    }
}

export async function deletePlace(id: string) {
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
        await prisma.place.delete({
            where: {
                id,
                userId: user.id,
            },
        });

        revalidatePath("/explore");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete place:", error);
        return { success: false, error: "Failed to delete place" };
    }
}
