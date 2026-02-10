"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cancelInvite } from "@/actions/invite";
import { toast } from "sonner";
import { useState } from "react";

interface CancelInviteButtonProps {
    inviteId: string;
}

export function CancelInviteButton({ inviteId }: CancelInviteButtonProps) {
    const [isPending, setIsPending] = useState(false);

    async function handleCancel() {
        setIsPending(true);
        try {
            await cancelInvite(inviteId);
            toast.success("Invite cancelled");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to cancel invite";
            toast.error(message);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
            onClick={handleCancel}
            disabled={isPending}
        >
            <X className="h-4 w-4" />
        </Button>
    );
}
