"use client";

import { useState, useRef, useCallback } from "react";
import { importPlanFromSpreadsheet } from "@/actions/event";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, X, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ImportPlanModalProps {
    tripId: string;
    children: React.ReactNode;
}

export function ImportPlanModal({ tripId, children }: ImportPlanModalProps) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFile = useCallback((f: File) => {
        const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-excel", // .xls
            "text/csv", // .csv
            "application/csv",
        ];
        const validExtensions = [".xlsx", ".xls", ".csv"];
        const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();

        if (!validTypes.includes(f.type) && !validExtensions.includes(ext)) {
            toast.error("Please upload an Excel (.xlsx, .xls) or CSV file");
            return;
        }

        setFile(f);
        setResult(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFile(droppedFile);
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleImport = async () => {
        if (!file) return;

        setIsLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await importPlanFromSpreadsheet(tripId, formData);

            setResult(res);

            if (res.success) {
                toast.success(res.message);
                router.refresh();
            } else {
                toast.error(res.error || "Import failed");
            }
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "An error occurred";
            toast.error("Import failed: " + msg);
            setResult({ success: false, error: msg });
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setFile(null);
        setResult(null);
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => {
            setOpen(v);
            if (!v) resetState();
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                        Import Plan
                    </DialogTitle>
                    <DialogDescription>
                        Upload an Excel or CSV file with your trip plan. AI will automatically parse and create events.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Dropzone */}
                    {!result?.success && (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer 
                                transition-all duration-200 ease-out
                                ${isDragging
                                    ? "border-primary bg-primary/5 scale-[1.02]"
                                    : file
                                        ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20"
                                        : "border-border hover:border-primary/50 hover:bg-accent/30"
                                }
                            `}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleFile(f);
                                }}
                            />

                            {file ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{file.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-muted-foreground"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            setResult(null);
                                        }}
                                    >
                                        <X className="h-3 w-3 mr-1" /> Remove
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center">
                                        <Upload className="h-7 w-7 text-muted-foreground/60" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm mb-1">
                                            Drop your file here or <span className="text-primary">browse</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Supports .xlsx, .xls, .csv
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className={`rounded-xl p-4 border ${result.success
                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                            : "bg-destructive/5 border-destructive/20"
                            }`}>
                            <div className="flex items-start gap-3">
                                {result.success ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">
                                        {result.success ? "Import Complete!" : "Import Failed"}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {result.success ? result.message : result.error}
                                    </p>
                                    {result.success && (
                                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                            <span>📊 Parsed: {result.totalParsed}</span>
                                            <span>✅ Created: {result.created}</span>
                                            {result.failed > 0 && <span>❌ Failed: {result.failed}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hints */}
                    {!file && !result && (
                        <div className="bg-muted/30 rounded-lg p-3 space-y-1.5">
                            <p className="text-xs font-medium text-foreground/80">💡 Tips for best results:</p>
                            <ul className="text-xs text-muted-foreground space-y-1 list-none">
                                <li>• Include columns for <strong>Name</strong>, <strong>Date</strong>, <strong>Time</strong>, <strong>Location</strong></li>
                                <li>• Add a <strong>Budget/Cost</strong> column if you have price estimates</li>
                                <li>• Use one row per activity/event</li>
                                <li>• Column names can be in <strong>any language</strong></li>
                            </ul>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        {result?.success ? (
                            <Button onClick={() => setOpen(false)} className="gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Done
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleImport}
                                    disabled={!file || isLoading}
                                    className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            AI is parsing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            Import Events
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
