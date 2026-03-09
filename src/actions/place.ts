"use server";

import { prisma } from "@/lib/prisma";
import { EventType } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as cheerio from "cheerio";
import { generateTextWithFallback, isLlmConfigured } from "@/lib/ai/llm";

const SOCIAL_MEDIA_SITES = [
    'instagram.com',
    'tiktok.com',
    'youtube.com/shorts',
    'youtube.com/watch',
    'facebook.com',
    't.me',
    'twitter.com',
    'x.com',
];

const GOOGLE_MAPS_SITES = [
    'google.com/maps',
    'google.co',
    'maps.app.goo.gl',
    'goo.gl/maps',
    'maps.google',
];

const SHORT_URL_DOMAINS = [
    'goo.gl',
    'bit.ly',
    'vm.tiktok.com',
    't.co',
    'youtu.be',
];

export interface ParsedPlace {
    title: string;
    description: string;
    image: string;
    url: string; // original source URL
    address: string;
    googleMapsUrl: string; // always a Google Maps link
    type: string; // Restaurant, Cafe, Bar, Hotel, Attraction, etc.
}

// ---------- HELPERS ----------

/** Generate a Google Maps search URL from place name + address */
function buildGoogleMapsUrl(name: string, address?: string): string {
    const query = [name, address].filter(Boolean).join(", ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Generate a Google Maps URL from lat/lng */
function buildGoogleMapsUrlFromCoords(lat: number, lng: number, placeName?: string): string {
    if (placeName) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}&query_place_id=&center=${lat},${lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/** Resolve short URLs (goo.gl, vm.tiktok.com, etc.) by following redirects */
async function resolveShortUrl(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            method: "HEAD",
            redirect: "follow",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });
        return response.url || url;
    } catch {
        // Fallback: try GET
        try {
            const response = await fetch(url, {
                redirect: "follow",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            });
            return response.url || url;
        } catch {
            return url;
        }
    }
}

/** Extract place name and coordinates from Google Maps URL patterns */
function parseGoogleMapsUrlData(url: string): { placeName?: string; lat?: number; lng?: number } {
    const result: { placeName?: string; lat?: number; lng?: number } = {};

    try {
        // Pattern 1: /maps/place/Place+Name/...
        const placeMatch = url.match(/\/maps\/place\/([^/@]+)/);
        if (placeMatch) {
            result.placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
        }

        // Pattern 2: /@lat,lng,zoom
        const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        if (coordMatch) {
            result.lat = parseFloat(coordMatch[1]);
            result.lng = parseFloat(coordMatch[2]);
        }

        // Pattern 3: ?q=Place+Name or &q=Place+Name
        const qMatch = url.match(/[?&]q=([^&]+)/);
        if (qMatch && !result.placeName) {
            result.placeName = decodeURIComponent(qMatch[1].replace(/\+/g, " "));
        }

        // Pattern 4: /maps/search/Place+Name
        const searchMatch = url.match(/\/maps\/search\/([^/@?]+)/);
        if (searchMatch && !result.placeName) {
            result.placeName = decodeURIComponent(searchMatch[1].replace(/\+/g, " "));
        }

        // Pattern 5: data segment e.g. !3d35.123!4d139.456 (lat/lng)       
        if (!result.lat || !result.lng) {
            const dataLatMatch = url.match(/!3d(-?\d+\.?\d*)/);
            const dataLngMatch = url.match(/!4d(-?\d+\.?\d*)/);
            if (dataLatMatch && dataLngMatch) {
                result.lat = parseFloat(dataLatMatch[1]);
                result.lng = parseFloat(dataLngMatch[1]);
            }
        }
    } catch {
        // Ignore parsing errors
    }

    return result;
}

/** Fetch post caption/metadata via oEmbed APIs */
async function fetchOEmbed(url: string): Promise<{ caption: string; authorName: string; thumbnailUrl: string } | null> {
    const lowerUrl = url.toLowerCase();

    try {
        // TikTok oEmbed
        if (lowerUrl.includes("tiktok.com")) {
            const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
            const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });
            if (res.ok) {
                const data = await res.json();
                return {
                    caption: data.title || "",
                    authorName: data.author_name || "",
                    thumbnailUrl: data.thumbnail_url || "",
                };
            }
        }

        // Instagram oEmbed (often requires token, but try anyway)
        if (lowerUrl.includes("instagram.com")) {
            const oembedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}&omitscript=true`;
            const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });
            if (res.ok) {
                const data = await res.json();
                return {
                    caption: data.title || "",
                    authorName: data.author_name || "",
                    thumbnailUrl: data.thumbnail_url || "",
                };
            }
        }

        // YouTube oEmbed
        if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });
            if (res.ok) {
                const data = await res.json();
                return {
                    caption: data.title || "",
                    authorName: data.author_name || "",
                    thumbnailUrl: data.thumbnail_url || "",
                };
            }
        }
    } catch (e: unknown) {
        console.error(`[oEmbed] Error: ${e instanceof Error ? e.message : String(e)}`);
    }

    return null;
}

// ---------- MAIN PARSER ----------

export async function parseLink(
    url: string,
    forceAi: boolean = false,
    userContext?: string
): Promise<{
    success: boolean;
    places?: ParsedPlace[];
    error?: string;
    isAiUsed?: boolean;
    isSocialMedia?: boolean;
}> {
    try {
        // Basic validation
        if (!url) return { success: false, error: "URL is required" };
        if (!url.startsWith("http")) {
            url = `https://${url}`;
        }



        // Step 0: Resolve short URLs
        const isShortUrl = SHORT_URL_DOMAINS.some(d => url.toLowerCase().includes(d));
        let resolvedUrl = url;
        if (isShortUrl) {
            resolvedUrl = await resolveShortUrl(url);

        }

        const isGoogleMaps = GOOGLE_MAPS_SITES.some(site => resolvedUrl.toLowerCase().includes(site));
        const isSocialMedia = SOCIAL_MEDIA_SITES.some(site => resolvedUrl.toLowerCase().includes(site));
        const shouldUseAi = isSocialMedia || isGoogleMaps || forceAi;



        let title = "";
        let description = "";
        let image = "";
        let oEmbedCaption = "";

        // Step 1: Google Maps URL — extract data programmatically first
        let gmapsData: { placeName?: string; lat?: number; lng?: number } = {};
        if (isGoogleMaps) {
            gmapsData = parseGoogleMapsUrlData(resolvedUrl);

            if (gmapsData.placeName) {
                title = gmapsData.placeName;
            }
        }

        // Step 2: oEmbed for social media
        if (isSocialMedia) {
            try {
                const oEmbedData = await fetchOEmbed(resolvedUrl);
                if (oEmbedData) {
                    oEmbedCaption = oEmbedData.caption || "";
                    if (!title) title = oEmbedData.authorName || "";
                    image = oEmbedData.thumbnailUrl || "";

                }
            } catch (e: unknown) {
                console.error(`[Parser] oEmbed failed: ${e instanceof Error ? e.message : String(e)}`);
            }
        }

        // Step 3: Standard HTML fetch (for OG metadata)
        try {
            const response = await fetch(resolvedUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
                redirect: "follow",
                next: { revalidate: 3600 },
            });

            if (response.url !== resolvedUrl) {
                resolvedUrl = response.url;

                // Re-check if it's Google Maps after redirect
                if (!isGoogleMaps && GOOGLE_MAPS_SITES.some(site => resolvedUrl.toLowerCase().includes(site))) {
                    gmapsData = parseGoogleMapsUrlData(resolvedUrl);
                    if (gmapsData.placeName && !title) {
                        title = gmapsData.placeName;
                    }
                }
            }

            if (response.ok) {
                const htmlSource = await response.text();
                const $ = cheerio.load(htmlSource);

                if (!title || title === "Google Maps") {
                    const metaTitle =
                        $('meta[property="og:title"]').attr("content") ||
                        $('meta[name="twitter:title"]').attr("content") ||
                        $("title").text() ||
                        "";
                    if (metaTitle && !metaTitle.includes("Google Maps") && metaTitle !== "Google Maps") {
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

                // Try to extract more from OG description for social media
                if (isSocialMedia && !oEmbedCaption && description) {
                    oEmbedCaption = description;
                }


            }
        } catch (e: unknown) {
            console.error(`[Parser] HTML fetch failed: ${e instanceof Error ? e.message : String(e)}`);
        }

        // Step 4: AI-enhanced parsing (always for social/maps, optional force)
        const hasApiKey = isLlmConfigured();
        const combinedContext = [oEmbedCaption, userContext, description].filter(Boolean).join("\n");


        if (shouldUseAi && hasApiKey) {

            try {
                const coordsInfo = gmapsData.lat && gmapsData.lng
                    ? `Coordinates found in URL: ${gmapsData.lat}, ${gmapsData.lng}`
                    : "";
                const placeNameInfo = gmapsData.placeName
                    ? `Place name extracted from URL: "${gmapsData.placeName}"`
                    : "";

                const prompt = `You are a travel assistant that extracts PLACES (restaurants, cafes, bars, hotels, attractions, etc.) from links and social media posts.

A user found interesting places and wants to save them for their trip planning.

**Original URL:** ${url}
**Resolved URL (after redirects):** ${resolvedUrl}
${placeNameInfo ? `**${placeNameInfo}**` : ""}
${coordsInfo ? `**${coordsInfo}**` : ""}
**Post caption / description (if available):**
"""
${combinedContext || "(no caption available)"}
"""
${title ? `**Page title:** "${title}"` : ""}

## YOUR TASK:
Based on the URL, caption, page title, and any other context provided above, extract ALL places mentioned. Each place should be a separate item.

## CRITICAL RULES:
1. **ALWAYS return an ARRAY of places**, even if there's only one place.
2. For each place, provide the EXACT name (e.g. "Trattoria da Mario"). If it's a known fake/scam place doing marketing (like Ethos in Austin), still extract it but mention its nature in the description.
3. If a post mentions multiple places (e.g. "5 best cafes in Tokyo"), extract EACH ONE as a separate entry.
4. For the "address" field: include the full address (street, city, country) if available. If you only know the city, write at least "City, Country". Never leave it empty — at minimum guess the city from context.
5. For Google Maps links: extract the place name from the URL segments.
6. For the "description" field: write 1-2 short sentences about what makes this place special. Be concise and useful.
7. For the "type" field: choose ONE of the following precise matches based on the place: "Food", "Nature", "Culture", "Must See", "Other".

## RESPONSE FORMAT:
Return ONLY a valid JSON array. No explanations, no markdown, no code fences.

[
  {
    "title": "Exact Place Name",
    "description": "Short helpful description (1-2 sentences)",
    "type": "Food",
    "address": "Full address: street, city, country"
  }
]

If the content mentions ZERO specific places (e.g. generic travel tips with no named locations), return an empty array: []`;

                const text = await generateTextWithFallback(prompt, {
                    systemPrompt: "Return only valid JSON.",
                    temperature: 0.2,
                });



                // Clean up response
                const jsonStr = text
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

                const aiPlaces: Array<{
                    title: string;
                    description: string;
                    type: string;
                    address: string;
                }> = JSON.parse(jsonStr);



                if (aiPlaces.length === 0) {
                    // AI found no places
                    if (isSocialMedia && !combinedContext && !title) {
                        return { success: true, isSocialMedia: true, places: undefined };
                    }
                    // Return what we have from HTML
                    return {
                        success: true,
                        isAiUsed: true,
                        places: title ? [{
                            title: title || "Unknown Place",
                            description: description || "",
                            image,
                            url,
                            address: "",
                            googleMapsUrl: buildGoogleMapsUrl(title),
                            type: "Other",
                        }] : undefined,
                    };
                }

                // Build ParsedPlace[] from AI results
                const places: ParsedPlace[] = aiPlaces.map(p => ({
                    title: p.title || "Unknown Place",
                    description: p.description || "",
                    image, // use the same image for all (from the post)
                    url, // original URL
                    address: p.address || "",
                    googleMapsUrl: buildGoogleMapsUrl(p.title, p.address),
                    type: p.type || "Other",
                }));

                // If Google Maps with coords and only 1 place, use coord-based URL
                if (gmapsData.lat && gmapsData.lng && places.length === 1) {
                    places[0].googleMapsUrl = buildGoogleMapsUrlFromCoords(
                        gmapsData.lat, gmapsData.lng, places[0].title
                    );
                }

                return {
                    success: true,
                    isAiUsed: true,
                    places,
                };
            } catch (aiError: unknown) {
                console.error(`[Parser] AI provider failed: ${aiError instanceof Error ? aiError.message : String(aiError)}`);
            }
        }

        // Fallback: If social media and we have nothing, ask user for context
        if (isSocialMedia && !combinedContext && !title) {
            return { success: true, isSocialMedia: true, places: undefined };
        }

        // Final fallback: return whatever we have from HTML metadata
        return {
            success: true,
            isAiUsed: false,
            places: [{
                title: title || "New Link",
                description,
                image,
                url,
                address: "",
                googleMapsUrl: title ? buildGoogleMapsUrl(title) : url,
                type: "Other",
            }],
        };
    } catch (error: unknown) {
        console.error("Link parsing error:", error);
        return { success: false, error: "Failed to parse link: " + (error instanceof Error ? error.message : String(error)) };
    }
}

// ---------- CRUD ----------

export async function savePlace(data: ParsedPlace) {
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
                location: data.address || null,
                source: data.type || "LINK_PARSER",
                userId: user.id,
            },
        });

        revalidatePath("/explore");
        return { success: true, place };
    } catch (error: unknown) {
        console.error("Failed to save place:", error);
        return { success: false, error: "Failed to save place" };
    }
}

export async function savePlaces(places: ParsedPlace[]) {
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
            places.map(data =>
                prisma.place.create({
                    data: {
                        name: data.title,
                        description: data.description,
                        image: data.image,
                        url: data.url,
                        location: data.address || null,
                        source: data.type || "LINK_PARSER",
                        userId: user.id,
                    },
                })
            )
        );

        revalidatePath("/explore");
        return { success: true, places: createdPlaces };
    } catch (error: unknown) {
        console.error("Failed to save places:", error);
        return { success: false, error: "Failed to save places" };
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

export async function convertPlaceToEvent(tripId: string, place: { title?: string; name?: string; description?: string | null; image?: string | null; url?: string | null; address?: string | null; location?: string | null; lat?: number | null; lng?: number | null; type?: string; source?: string }) {
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

    const VALID_EVENT_TYPES: EventType[] = ["FLIGHT", "HOTEL", "ACTIVITY", "RESTAURANT", "TRANSPORT", "OTHER"];

    try {
        // Map place types to EventType enum — check type first, then source (saved places use source)
        let eventType: EventType = "ACTIVITY";
        const lowerType = (place.type || place.source)?.toLowerCase() || "";
        if (lowerType.includes("food") || lowerType.includes("restaurant") || lowerType.includes("cafe") || lowerType.includes("bar")) eventType = "RESTAURANT";
        else if (lowerType.includes("hotel") || lowerType.includes("hostel") || lowerType.includes("stay") || lowerType.includes("accommodation")) eventType = "HOTEL";
        else if (lowerType.includes("flight") || lowerType.includes("transport")) eventType = "TRANSPORT";

        if (!VALID_EVENT_TYPES.includes(eventType)) {
            eventType = "ACTIVITY";
        }

        const event = await prisma.event.create({
            data: {
                tripId,
                title: title,
                description: place.description || "",
                type: eventType,
                startTime: new Date(),
                endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
                location: place.address || place.location || title,
                lat: place.lat,
                lng: place.lng,
                url: place.url,
                coverImage: place.image,
                createdBy: user.id,
                isSuggested: true,
            },
        });

        const placeTypeValue = place.type || place.source || null;
        if (placeTypeValue) {
            try {
                await prisma.event.update({
                    where: { id: event.id },
                    data: { placeType: placeTypeValue },
                });
            } catch {
                // ignore if client cache doesn't support placeType yet
            }
        }

        revalidatePath(`/trip/${tripId}/suggested`);
        return { success: true, event: { ...event, placeType: placeTypeValue } };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Failed to convert place to event:", error);
        return {
            success: false,
            error: process.env.NODE_ENV === "development" ? message : "Failed to add to trip",
        };
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
    } catch (error: unknown) {
        console.error("Failed to delete place:", error);
        return { success: false, error: "Failed to delete place" };
    }
}
