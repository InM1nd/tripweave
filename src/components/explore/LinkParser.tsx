"use client";

import { useState } from "react";
import { parseLink, ParsedLink, savePlace } from "@/actions/place";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, Link as LinkIcon, Save, MessageSquareText } from "lucide-react";
import { toast } from "sonner";

export function LinkParser() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [parsedData, setParsedData] = useState<(ParsedLink & { isAiUsed?: boolean }) | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [forceAi, setForceAi] = useState(false);

    // Fallback: manual context input (only shown when oEmbed + AI both fail)
    const [showContextInput, setShowContextInput] = useState(false);
    const [userContext, setUserContext] = useState("");

    const handleAnalyze = async () => {
        if (!url) return;
        setIsLoading(true);
        setParsedData(null);
        setShowContextInput(false);

        try {
            const result = await parseLink(url, forceAi);

            // If social media and no data could be extracted at all (oEmbed + AI failed)
            if (result.isSocialMedia && !result.data) {
                setShowContextInput(true);
                toast.info("We couldn't read the post automatically. Paste the description below to help our AI.");
                setIsLoading(false);
                return;
            }

            if (result.success && result.data) {
                setParsedData({ ...result.data, isAiUsed: result.isAiUsed });
                toast.success(result.isAiUsed ? "AI analysis complete!" : "Link analyzed successfully!");
            } else {
                toast.error(result.error || "Failed to analyze link");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyzeWithContext = async () => {
        if (!url || !userContext.trim()) {
            toast.error("Please paste the description from the post");
            return;
        }
        setIsLoading(true);

        try {
            const result = await parseLink(url, true, userContext);
            if (result.success && result.data) {
                setParsedData({ ...result.data, isAiUsed: true });
                setShowContextInput(false);
                toast.success("AI analysis complete!");
            } else {
                toast.error(result.error || "AI could not extract place info. Try a more detailed description.");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!parsedData) return;
        setIsSaving(true);
        try {
            const result = await savePlace(parsedData);
            if (result.success) {
                toast.success("Place saved to your list!");
                setParsedData(null);
                setUrl("");
                setUserContext("");
            } else {
                toast.error(result.error || "Failed to save place");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Paste a link (TikTok, Instagram, Google Maps, etc.)..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="pl-10 h-10"
                            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                        />
                    </div>
                    <Button
                        onClick={handleAnalyze}
                        disabled={isLoading || !url}
                        className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        Analyze
                    </Button>
                </div>

                <div className="flex items-center gap-2 px-1">
                    <input
                        type="checkbox"
                        id="force-ai"
                        checked={forceAi}
                        onChange={(e) => setForceAi(e.target.checked)}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-600 cursor-pointer"
                    />
                    <label htmlFor="force-ai" className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                        Force Deep AI Analysis (uses Gemini)
                    </label>
                </div>
            </div>

            {/* Fallback: manual context input (if auto-extraction failed) */}
            {showContextInput && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/10">
                        <CardContent className="p-4 md:p-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                    <MessageSquareText className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-sm">Help our AI understand this post</h3>
                                    <p className="text-xs text-muted-foreground">
                                        We couldn&apos;t read this post automatically. Copy the caption from the post and paste it below — our AI will extract the place info.
                                    </p>
                                </div>
                            </div>

                            <textarea
                                value={userContext}
                                onChange={(e) => setUserContext(e.target.value)}
                                placeholder={"Paste the post caption here...\n\nExample: 'Amazing pasta at Trattoria da Mario 🍝 \nVia Roma 42, Florence, Italy\n#italy #florence #foodie'"}
                                className="w-full min-h-[120px] p-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-muted-foreground/50"
                            />

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleAnalyzeWithContext}
                                    disabled={isLoading || !userContext.trim()}
                                    className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                    Analyze with AI
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Parsed result preview */}
            {parsedData && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="overflow-hidden border-violet-200 dark:border-violet-900 bg-violet-50/50 dark:bg-violet-950/10 relative">
                        {parsedData.isAiUsed && (
                            <div className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center gap-1 z-10">
                                <Sparkles className="h-2.5 w-2.5" />
                                AI ENHANCED
                            </div>
                        )}
                        <div className="flex flex-col md:flex-row">
                            {parsedData.image && (
                                <div className="aspect-video md:aspect-square md:w-48 relative overflow-hidden bg-muted">
                                    <img
                                        src={parsedData.image}
                                        alt={parsedData.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <CardContent className="flex-1 p-4 md:p-6 flex flex-col justify-between gap-4">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg leading-tight">{parsedData.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {parsedData.description}
                                    </p>
                                    <a
                                        href={parsedData.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                    >
                                        <LinkIcon className="h-3 w-3" />
                                        {new URL(parsedData.url).hostname}
                                    </a>
                                </div>

                                <div className="flex justify-end">
                                    <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        Save to My List
                                    </Button>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
