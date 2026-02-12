"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Loader2, FileText, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpload } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploadProps {
    value?: string;
    onChange: (value: string) => void;
    onUploadComplete?: (file: File) => void;
    disabled?: boolean;
    endpoint?: string; // Bucket name
    folder?: string;
    className?: string;
}

export function FileUpload({
    value,
    onChange,
    onUploadComplete,
    disabled,
    endpoint = "documents", // Default bucket for documents
    folder = "",
    className,
}: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const { uploadFile } = useUpload();
    const [fileName, setFileName] = useState<string | null>(null);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setIsUploading(true);
            setFileName(file.name);
            try {
                const url = await uploadFile(file, endpoint, folder);
                if (url) {
                    onChange(url);
                    if (onUploadComplete) {
                        onUploadComplete(file);
                    }
                    toast.success("File uploaded");
                }
            } catch (error) {
                toast.error("Upload failed");
                setFileName(null);
            } finally {
                setIsUploading(false);
            }
        },
        [onChange, onUploadComplete, uploadFile, endpoint, folder]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        disabled: disabled || isUploading,
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setFileName(null);
    };

    return (
        <div className={cn("w-full", className)}>
            {value ? (
                <div className="relative flex items-center p-4 rounded-lg border border-border bg-muted/50 group">
                    <FileText className="h-8 w-8 text-blue-500 mr-3 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate pr-8">
                            {fileName || value.split("/").pop()}
                        </p>
                        <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:underline"
                        >
                            View file
                        </a>
                    </div>
                    <Button
                        type="button"
                        onClick={handleRemove}
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={disabled || isUploading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors min-h-[120px] bg-muted/20 hover:bg-muted/40",
                        isDragActive && "border-primary bg-primary/5",
                        (disabled || isUploading) && "opacity-50 cursor-not-allowed",
                        className
                    )}
                >
                    <Input {...getInputProps()} />
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Uploading {fileName}...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="p-3 bg-background rounded-full shadow-sm">
                                <UploadCloud className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">
                                    {isDragActive ? "Drop here" : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    PDF, Images, Word, Excel (max 10MB)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const Input = (props: any) => <input {...props} />;
