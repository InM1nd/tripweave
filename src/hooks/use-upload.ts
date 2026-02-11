"use client";

import { createClient } from "@/lib/supabase/client"; // Use browser client
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UseUploadReturn {
    uploadFile: (file: File, bucket: string, folder?: string) => Promise<string | null>;
    isUploading: boolean;
}

export function useUpload(): UseUploadReturn {
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();

    const uploadFile = async (file: File, bucket: string, folder: string = ""): Promise<string | null> => {
        setIsUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = folder ? `${folder}/${fileName}` : fileName;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error: any) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload image");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFile, isUploading };
}
