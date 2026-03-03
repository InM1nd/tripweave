type LlmProvider = "groq" | "openrouter" | "gemini";

interface ProviderConfig {
    provider: LlmProvider;
    apiKey: string;
    model: string;
    endpoint: string;
    headers?: Record<string, string>;
}

interface GenerateTextOptions {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
}

interface ContentChunk {
    text?: string;
}

interface ChatCompletionResponse {
    choices?: Array<{
        message?: {
            content?: string | ContentChunk[];
        };
    }>;
}

class ProviderHttpError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "ProviderHttpError";
        this.status = status;
    }
}

const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const DEFAULT_OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

const RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getProviderConfigs(): ProviderConfig[] {
    const providers: ProviderConfig[] = [];

    if (process.env.GROQ_API_KEY) {
        providers.push({
            provider: "groq",
            apiKey: process.env.GROQ_API_KEY,
            model: DEFAULT_GROQ_MODEL,
            endpoint: "https://api.groq.com/openai/v1/chat/completions",
        });
    }

    if (process.env.OPENROUTER_API_KEY) {
        providers.push({
            provider: "openrouter",
            apiKey: process.env.OPENROUTER_API_KEY,
            model: DEFAULT_OPENROUTER_MODEL,
            endpoint: "https://openrouter.ai/api/v1/chat/completions",
            headers: {
                "HTTP-Referer": process.env.OPENROUTER_REFERER || "http://localhost:3000",
                "X-Title": process.env.OPENROUTER_APP_NAME || "TripWeave",
            },
        });
    }

    return providers;
}

export function isLlmConfigured(): boolean {
    return getProviderConfigs().length > 0;
}

async function callProvider(
    config: ProviderConfig,
    prompt: string,
    options?: GenerateTextOptions
): Promise<string> {
    const body = {
        model: config.model,
        messages: [
            ...(options?.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
            { role: "user", content: prompt },
        ],
        temperature: options?.temperature ?? 0.2,
        max_tokens: options?.maxTokens,
    };

    const res = await fetch(config.endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
            ...(config.headers || {}),
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const raw = await res.text();
        throw new ProviderHttpError(
            `[${config.provider}] ${res.status} ${res.statusText}: ${raw.slice(0, 500)}`,
            res.status
        );
    }

    const data = (await res.json()) as ChatCompletionResponse;
    const content = data?.choices?.[0]?.message?.content;

    if (typeof content === "string" && content.trim()) {
        return content;
    }

    if (Array.isArray(content)) {
        const combined = content
            .map((chunk) => (typeof chunk?.text === "string" ? chunk.text : ""))
            .join("")
            .trim();
        if (combined) return combined;
    }

    throw new Error(`[${config.provider}] Empty response content`);
}

export async function generateTextWithFallback(
    prompt: string,
    options?: GenerateTextOptions
): Promise<string> {
    const providers = getProviderConfigs();
    if (providers.length === 0) {
        throw new Error("No AI providers configured (expected GROQ_API_KEY and/or OPENROUTER_API_KEY)");
    }

    let lastError: unknown = null;

    for (const provider of providers) {
        const attempts = 3;
        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                return await callProvider(provider, prompt, options);
            } catch (error: unknown) {
                lastError = error;
                const status = error instanceof ProviderHttpError ? error.status : 0;
                const retryable = RETRYABLE_STATUS.has(status);
                if (!retryable || attempt === attempts) {
                    break;
                }
                const backoff = attempt * 1200;
                await sleep(backoff);
            }
        }
    }

    throw lastError instanceof Error ? lastError : new Error("All AI providers failed");
}

// ─── Vision API ─────────────────────────────────────────────────────

const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || "llama-3.2-90b-vision-preview";
const OPENROUTER_VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "google/gemini-2.5-flash";
const GEMINI_VISION_MODEL = process.env.GEMINI_VISION_MODEL || "gemma-3-27b-it";

interface VisionProviderConfig {
    provider: LlmProvider;
    apiKey: string;
    model: string;
    endpoint: string;
    headers?: Record<string, string>;
}

function getVisionProviderConfigs(): VisionProviderConfig[] {
    const providers: VisionProviderConfig[] = [];

    // Prioritize Gemini (Native Google API) if available for free and direct access
    if (process.env.GEMINI_API_KEY) {
        providers.push({
            provider: "gemini",
            apiKey: process.env.GEMINI_API_KEY,
            model: GEMINI_VISION_MODEL,
            endpoint: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        });
    }

    // Keep OpenRouter as fallback
    if (process.env.OPENROUTER_API_KEY) {
        providers.push({
            provider: "openrouter",
            apiKey: process.env.OPENROUTER_API_KEY,
            model: OPENROUTER_VISION_MODEL,
            endpoint: "https://openrouter.ai/api/v1/chat/completions",
            headers: {
                "HTTP-Referer": process.env.OPENROUTER_REFERER || "http://localhost:3000",
                "X-Title": process.env.OPENROUTER_APP_NAME || "TripWeave",
            },
        });
    }

    if (process.env.GROQ_API_KEY && process.env.GROQ_VISION_MODEL) {
        providers.push({
            provider: "groq",
            apiKey: process.env.GROQ_API_KEY,
            model: GROQ_VISION_MODEL,
            endpoint: "https://api.groq.com/openai/v1/chat/completions",
        });
    }

    return providers;
}

export async function analyzeImageUrl(
    imageUrl: string | string[],
    prompt: string
): Promise<string> {
    const providers = getVisionProviderConfigs();
    if (providers.length === 0) {
        throw new Error("No vision AI providers configured");
    }

    let lastError: unknown = null;
    const urls = Array.isArray(imageUrl) ? imageUrl : [imageUrl];

    // Some models (like Google's Gemma over OpenAI API) struggle to fetch raw urls, 
    // so we download them into base64 upfront. This is more robust for TikTok expiring links too.
    const resolvedImagesObj: { url: string }[] = [];
    for (const u of urls) {
        if (u.startsWith("data:")) {
            resolvedImagesObj.push({ url: u });
            continue;
        }
        try {
            const res = await fetch(u, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Referer": "https://www.tiktok.com/"
                }
            });
            if (!res.ok) throw new Error(`Image fetch failed: ${res.status} ${res.statusText}`);
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const mime = res.headers.get("content-type") || "image/jpeg";
            resolvedImagesObj.push({ url: `data:${mime};base64,${buffer.toString("base64")}` });
        } catch (e) {
            console.warn(`[Vision] Failed to download image to base64: ${u}`, e);
            // Return the raw url as a desperate fallback
            resolvedImagesObj.push({ url: u });
        }
    }

    for (const config of providers) {
        try {
            const body = {
                model: config.model,
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            ...resolvedImagesObj.map(obj => ({
                                type: "image_url",
                                image_url: { url: obj.url }
                            })),
                        ],
                    },
                ],
                temperature: 0.2,
                max_tokens: 1024,
            };

            const res = await fetch(config.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${config.apiKey}`,
                    ...(config.headers || {}),
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const raw = await res.text();
                throw new ProviderHttpError(
                    `[${config.provider}/vision] ${res.status}: ${raw.slice(0, 300)}`,
                    res.status
                );
            }

            const data = (await res.json()) as ChatCompletionResponse;
            const content = data?.choices?.[0]?.message?.content;
            if (typeof content === "string" && content.trim()) {
                return content.trim();
            }
            console.warn(`[Vision] Missing content in response:`, JSON.stringify(data));
            throw new Error(`[${config.provider}/vision] Empty response`);
        } catch (error: unknown) {
            lastError = error;
            console.warn(`[Vision] ${config.provider} failed:`, error instanceof Error ? error.message : error);
        }
    }

    throw lastError instanceof Error ? lastError : new Error("All vision providers failed");
}
