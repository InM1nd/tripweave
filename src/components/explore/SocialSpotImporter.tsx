"use client";

import { useState, useCallback } from "react";
import {
    importSocialSpots,
    saveSpotAsPlace,
    saveAllSpotsAsPlaces,
    ExtractedSpot,
    ImporterResult,
} from "@/actions/social-spot-importer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StickerAnimator } from "@/components/ui/StickerAnimator";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Sparkles,
    Link as LinkIcon,
    Save,
    MapPin,
    ExternalLink,
    Check,
    SaveAll,
    MessageSquareText,
    Instagram,
    Youtube,
    Globe,
    Lightbulb,
    ArrowRight,
    Zap,
    TrendingUp,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

// TikTok icon
function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.23 8.23 0 004.76 1.52V7.05a4.83 4.83 0 01-1-.36z" />
        </svg>
    );
}

// Category config
const CATEGORY_CONFIG: Record<string, { color: string; emoji: string }> = {
    restaurant: { color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", emoji: "🍽️" },
    cafe: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", emoji: "☕" },
    bar: { color: "bg-gold/15 text-gold dark:bg-gold/20 dark:text-gold", emoji: "🍸" },
    museum: { color: "bg-teal/15 text-teal dark:bg-teal/20 dark:text-teal", emoji: "🏛️" },
    art: { color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400", emoji: "🎨" },
    park: { color: "bg-success/15 text-success dark:bg-success/20 dark:text-success", emoji: "🌿" },
    beach: { color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400", emoji: "🏖️" },
    viewpoint: { color: "bg-rose/15 text-rose dark:bg-rose/20 dark:text-rose", emoji: "🏔️" },
    market: { color: "bg-gold/15 text-gold dark:bg-gold/20 dark:text-gold", emoji: "🏪" },
    shopping: { color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", emoji: "🛍️" },
    nightlife: { color: "bg-accent-subtle text-accent", emoji: "🌃" },
    temple: { color: "bg-danger-subtle text-danger dark:bg-danger/30 dark:text-danger", emoji: "⛩️" },
    hotel: { color: "bg-teal/15 text-teal", emoji: "🏨" },
    transport: { color: "bg-muted text-foreground", emoji: "🚄" },
    attraction: { color: "bg-accent/15 text-accent", emoji: "⭐" },
    other: { color: "bg-muted text-muted-foreground", emoji: "📍" },
};

function getCategoryConfig(category: string) {
    return CATEGORY_CONFIG[category.toLowerCase()] || CATEGORY_CONFIG.other;
}

function getPlatformIcon(platform: ImporterResult["platform"]) {
    switch (platform) {
        case "instagram": return <Instagram className="h-4 w-4" />;
        case "tiktok": return <TikTokIcon className="h-4 w-4" />;
        case "youtube_shorts": return <Youtube className="h-4 w-4" />;
        default: return <Globe className="h-4 w-4" />;
    }
}

function getPlatformLabel(platform: ImporterResult["platform"]) {
    switch (platform) {
        case "instagram": return "Instagram";
        case "tiktok": return "TikTok";
        case "youtube_shorts": return "YouTube Shorts";
        default: return "Social Media";
    }
}

function getPlatformGradient(platform: ImporterResult["platform"]) {
    switch (platform) {
        case "instagram": return "from-pink-500 via-purple-500 to-orange-500";
        case "tiktok": return "from-black via-gray-800 to-cyan-500";
        case "youtube_shorts": return "from-red-500 to-red-700";
        default: return "from-accent to-accent-hover";
    }
}

function ConfidenceMeter({ confidence }: { confidence: number }) {
    const percentage = Math.round(confidence * 100);
    const color =
        confidence >= 0.8 ? "bg-success" :
            confidence >= 0.5 ? "bg-amber-500" :
                "bg-danger";
    return (
        <div className="flex items-center gap-1.5">
            <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${percentage}%` }} />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{percentage}%</span>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────

export function SocialSpotImporter() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ImporterResult | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [savedSpots, setSavedSpots] = useState<Set<string>>(new Set());
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Optional context — always available (collapsed by default)
    const [showContext, setShowContext] = useState(false);
    const [userContext, setUserContext] = useState("");

    // Analyzing animation
    const [analyzePhase, setAnalyzePhase] = useState("");

    const handleAnalyze = useCallback(async () => {
        if (!url) return;
        setIsLoading(true);
        setResult(null);
        setSavedSpots(new Set());
        setErrorMsg(null);

        // Animate phases
        const phases = [
            "Identifying platform...",
            "Fetching post metadata...",
            "AI analyzing post content...",
            "Extracting travel spots...",
        ];
        let phaseIndex = 0;
        setAnalyzePhase(phases[0]);
        const phaseInterval = setInterval(() => {
            phaseIndex = Math.min(phaseIndex + 1, phases.length - 1);
            setAnalyzePhase(phases[phaseIndex]);
        }, 2000);

        try {
            const importResult = await importSocialSpots({
                url,
                content: userContext.trim() || undefined,
            });

            clearInterval(phaseInterval);
            setAnalyzePhase("");

            if (importResult.success && importResult.spots.length > 0) {
                setResult(importResult);
                toast.success(`Found ${importResult.spots.length} travel spot${importResult.spots.length > 1 ? "s" : ""}!`);
            } else if (importResult.error) {
                setErrorMsg(importResult.error);
                toast.error(importResult.error);
            } else if (importResult.reason) {
                setResult(importResult);
                toast.info(importResult.reason);
            } else {
                setErrorMsg("No travel spots found in this post.");
                toast.info("No travel spots found in this post.");
            }
        } catch (err: unknown) {
            clearInterval(phaseInterval);
            setAnalyzePhase("");
            const msg = err instanceof Error ? err.message : "Something went wrong";
            setErrorMsg(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }, [url, userContext]);

    const handleSaveOne = async (spot: ExtractedSpot) => {
        setIsSaving(true);
        try {
            const saveResult = await saveSpotAsPlace(spot, url);
            if (saveResult.success) {
                setSavedSpots(prev => new Set(prev).add(spot.spot_id));
                toast.success(`"${spot.name}" saved!`);
            } else {
                toast.error(saveResult.error || "Failed to save");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveAll = async () => {
        if (!result) return;
        const unsaved = result.spots.filter(s => !savedSpots.has(s.spot_id));
        if (unsaved.length === 0) {
            toast.info("All spots already saved");
            return;
        }
        setIsSaving(true);
        try {
            const saveResult = await saveAllSpotsAsPlaces(unsaved, url);
            if (saveResult.success) {
                setSavedSpots(new Set(result.spots.map(s => s.spot_id)));
                toast.success(`${unsaved.length} spots saved!`);
            } else {
                toast.error(saveResult.error || "Failed to save");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const allSaved = result ? result.spots.length > 0 && savedSpots.size === result.spots.length : false;

    return (
        <div className="space-y-5">
            {/* URL + Context Input */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Paste Instagram, TikTok, or YouTube Shorts link..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="pl-10 h-10"
                            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                        />
                    </div>
                    <Button
                        onClick={handleAnalyze}
                        disabled={isLoading || !url}
                        className="gap-2 bg-accent hover:bg-accent-hover text-accent-text border-2 border-border shadow-sticker-sm hover:-translate-y-0.5 hover:shadow-sticker-card transition-all min-w-[130px] rounded-full font-black"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                        {isLoading ? "Analyzing..." : "Import Spots"}
                    </Button>
                </div>

                {/* Supported platforms + optional context toggle */}
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">Supports:</span>
                        <div className="flex items-center gap-1.5">
                            <Badge className="text-[10px] gap-1 py-0 h-5 bg-sticker-pink text-sticker-foreground border-2 border-border shadow-sticker-badge rounded-full">
                                <Instagram className="h-2.5 w-2.5" /> Instagram
                            </Badge>
                            <Badge className="text-[10px] gap-1 py-0 h-5 bg-sticker-blue text-sticker-foreground border-2 border-border shadow-sticker-badge rounded-full">
                                <TikTokIcon className="h-2.5 w-2.5" /> TikTok
                            </Badge>
                            <Badge className="text-[10px] gap-1 py-0 h-5 bg-sticker-coral text-white border-2 border-border shadow-sticker-badge rounded-full">
                                <Youtube className="h-2.5 w-2.5" /> Shorts
                            </Badge>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowContext(!showContext)}
                        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <MessageSquareText className="h-3 w-3" />
                        {showContext ? "Hide" : "Add"} caption
                        {showContext ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                </div>

                {/* Optional context textarea — always available */}
                {showContext && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground px-1">
                                Paste the post caption or description here for better results (especially helpful for Instagram private posts).
                            </p>
                            <textarea
                                value={userContext}
                                onChange={(e) => setUserContext(e.target.value)}
                                placeholder={"Paste the post caption/description here...\n\nExample: 'TOP 5 spots in Tokyo 🇯🇵\n1. TeamLab Planets — 3800¥\n2. Shibuya Sky — best view\n3. Golden Gai — tiny bars\n4. Tsukiji Market — fresh sushi\n5. Ichiran Ramen — 980¥'"}
                                className="w-full min-h-[120px] p-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-muted-foreground/40"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Loading animation */}
            {isLoading && analyzePhase && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="border-accent/20 overflow-hidden shadow-sticker-sm-soft">
                        <div className="h-1 bg-gradient-to-r from-accent to-accent-hover animate-pulse" />
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center animate-pulse">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full animate-ping" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold">AI Agent Working...</p>
                                <p className="text-xs text-muted-foreground animate-pulse">{analyzePhase}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Error message */}
            {errorMsg && !isLoading && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="border-danger/30 dark:border-danger bg-danger-subtle dark:bg-danger-subtle shadow-sticker-sm-soft">
                        <CardContent className="p-4 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <p className="text-sm text-danger dark:text-danger">{errorMsg}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* No spots reason */}
            {result && result.spots.length === 0 && result.reason && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="border-muted shadow-sticker-sm-soft">
                        <CardContent className="p-6 text-center space-y-3">
                            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                            <p className="text-sm text-muted-foreground">{result.reason}</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Results */}
            {result && result.spots.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Badge className={`bg-gradient-to-r ${getPlatformGradient(result.platform)} text-white text-[10px] gap-1 border-0`}>
                                {getPlatformIcon(result.platform)}
                                {getPlatformLabel(result.platform)}
                            </Badge>
                            <Badge className="bg-accent text-accent-text text-[10px] gap-1 border-0">
                                <Sparkles className="h-2.5 w-2.5" />
                                AI EXTRACTED
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {result.spots.length} spot{result.spots.length !== 1 ? "s" : ""} found
                            </span>
                        </div>
                        {result.spots.length > 1 && (
                            <Button onClick={handleSaveAll} disabled={isSaving || allSaved} size="sm" variant={allSaved ? "outline" : "default"} className="gap-2">
                                {allSaved ? (<><Check className="h-3.5 w-3.5" /> All Saved</>) :
                                    isSaving ? (<Loader2 className="h-3.5 w-3.5 animate-spin" />) :
                                        (<><SaveAll className="h-3.5 w-3.5" /> Save All</>)}
                            </Button>
                        )}
                    </div>

                    {/* Post metadata */}
                    {(result.metadata?.author || result.metadata?.post_title) && (
                        <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
                            {result.metadata.author && (
                                <span>From <strong className="text-foreground">@{result.metadata.author}</strong></span>
                            )}
                            {result.metadata.author && result.metadata.post_title && (
                                <ArrowRight className="h-3 w-3" />
                            )}
                            {result.metadata.post_title && (
                                <span className="truncate max-w-xs">{result.metadata.post_title}</span>
                            )}
                        </div>
                    )}

                    {/* Spot cards */}
                    <div className="space-y-3">
                        {result.spots.map((spot, index) => {
                            const isSaved = savedSpots.has(spot.spot_id);
                            const catConfig = getCategoryConfig(spot.category);

                            return (
                                <StickerAnimator key={spot.spot_id} delay={index * 0.06}>
                                    <Card
                                        className={`overflow-hidden transition-all duration-300 ${isSaved
                                            ? "border-success/50 bg-success/10 shadow-sticker-sm-soft"
                                            : "border-accent/20 shadow-sticker-card hover:border-accent/40 hover:shadow-sticker-card-hover"
                                            }`}
                                    >
                                    <CardContent className="p-4 md:p-5 space-y-3">
                                        {/* Top row */}
                                        <div className="flex items-start gap-3">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover text-accent-text text-sm font-bold shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-bold text-base md:text-lg leading-tight">{spot.name}</h3>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <Badge variant="outline" className={`text-[10px] gap-1 py-0.5 ${catConfig.color} border-0`}>
                                                            <span>{catConfig.emoji}</span>
                                                            {spot.category}
                                                        </Badge>
                                                        <ConfidenceMeter confidence={spot.confidence} />
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{spot.description}</p>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        {spot.address && (
                                            <div className="flex items-start gap-2 text-xs text-muted-foreground pl-11">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent" />
                                                <span>{spot.address}</span>
                                            </div>
                                        )}

                                        {/* Tips */}
                                        {spot.tips && (
                                            <div className="flex items-start gap-2 text-xs pl-11 bg-amber-50 dark:bg-amber-950/20 rounded-lg p-2.5">
                                                <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                                                <span className="text-amber-800 dark:text-amber-300">{spot.tips}</span>
                                            </div>
                                        )}

                                        {/* Source evidence */}
                                        {spot.source_evidence && (
                                            <div className="flex items-start gap-2 text-[11px] text-muted-foreground/60 pl-11">
                                                <TrendingUp className="h-3 w-3 shrink-0 mt-0.5" />
                                                <span className="italic">{spot.source_evidence}</span>
                                            </div>
                                        )}



                                        {/* Actions */}
                                        <div className="flex flex-wrap items-center gap-2 pt-1 pl-11">
                                            <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
                                                <a href={spot.maps_url} target="_blank" rel="noreferrer">
                                                    <MapPin className="h-3 w-3" />
                                                    Open in Maps
                                                    <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                                                </a>
                                            </Button>

                                            <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs text-muted-foreground">
                                                <a href={url} target="_blank" rel="noreferrer">
                                                    <LinkIcon className="h-3 w-3" />
                                                    Source
                                                </a>
                                            </Button>

                                            <div className="flex-1" />

                                            <Button
                                                onClick={() => handleSaveOne(spot)}
                                                disabled={isSaving || isSaved}
                                                size="sm"
                                                variant={isSaved ? "outline" : "default"}
                                                className={`gap-1.5 ${isSaved ? "text-success border-success/50" : ""}`}
                                            >
                                                {isSaved ? (<><Check className="h-3.5 w-3.5" /> Saved</>) :
                                                    isSaving ? (<Loader2 className="h-3.5 w-3.5 animate-spin" />) :
                                                        (<><Save className="h-3.5 w-3.5" /> Save</>)}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                </StickerAnimator>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
