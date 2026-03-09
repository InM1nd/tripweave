"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUpload } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    endpoint?: string; // Bucket name
    folder?: string;
    className?: string;
}

export function ImageUpload({
    value,
    onChange,
    disabled,
    endpoint = "trip-covers",
    folder = "",
    className,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const { uploadFile } = useUpload(); // We'll use the hook's logic but manage local loading state to avoid conflicts if needed

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setIsUploading(true);
            try {
                const url = await uploadFile(file, endpoint, folder);
                if (url) {
                    onChange(url);
                    toast.success("Image uploaded");
                }
            } catch {
                toast.error("Upload failed");
            } finally {
                setIsUploading(false);
            }
        },
        [onChange, uploadFile, endpoint, folder]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
        },
        maxFiles: 1,
        disabled: disabled || isUploading,
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    return (
        <div className={cn("w-full", className)}>
            {value ? (
                <div className="relative h-32 w-full rounded-xl overflow-hidden border-2 border-border bg-muted shadow-sticker-sm-soft group">
                    <Image
                        src={value}
                        alt="Upload"
                        fill
                        unoptimized
                        className="object-cover transition-opacity group-hover:opacity-90"
                    />
                    <div className="absolute top-2 right-2">
                        <Button
                            type="button"
                            onClick={handleRemove}
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6"
                            disabled={disabled || isUploading}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-2 border-dashed rounded-xl p-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors h-32 bg-muted/20 hover:bg-muted/40",
                        isDragActive && "border-primary bg-primary/5",
                        (disabled || isUploading) && "opacity-50 cursor-not-allowed",
                        className
                    )}
                >
                    <input {...getInputProps()} />
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="p-2 bg-background rounded-full shadow-sm">
                                <UploadCloud className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium">
                                    {isDragActive ? "Drop here" : "Upload Image"}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    Max 5MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
