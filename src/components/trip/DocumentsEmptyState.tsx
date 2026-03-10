"use client";

import { Upload } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { AddDocumentModal } from "@/components/trip/AddDocumentModal";
import { getStickerBgClass } from "@/lib/design-tokens";

interface DocumentsEmptyStateProps {
  tripId: string;
}

export function DocumentsEmptyState({ tripId }: DocumentsEmptyStateProps) {
  return (
    <EmptyState
      variant="sticker"
      icon={Upload}
      iconBgColor="coral"
      title="No documents yet"
      description="Add links to bookings, tickets, or files to keep everything in one place."
      action={
        <AddDocumentModal tripId={tripId}>
          <Button
            className={`gap-1.5 font-bold border-2 border-border shadow-sticker-sm hover:-translate-y-px transition-all rounded-xl ${getStickerBgClass("green")} hover:bg-sticker-green/90 h-10 px-4 text-sm`}
          >
            <Upload className="h-3.5 w-3.5" strokeWidth={3} />
            Add Document
          </Button>
        </AddDocumentModal>
      }
      className="col-span-2 md:col-span-3 lg:col-span-4 min-h-[200px]"
    />
  );
}
