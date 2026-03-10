import { getTripDocuments } from "@/actions/document";
import { StickerAnimator } from "@/components/ui/StickerAnimator";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Image as ImageIcon,
  Upload,
  Search,
  Grid,
  List as ListIcon,
  File
} from "lucide-react";
import { AddDocumentModal } from "@/components/trip/AddDocumentModal";
import { formatDistanceToNow } from "date-fns";
import { TripDocumentCard, DocumentBadge } from "@/components/trip/TripDocumentCard";
import { StickerSurface } from "@/components/ui/StickerSurface";
import { DocumentsEmptyState } from "@/components/trip/DocumentsEmptyState";

const FileIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "PDF":
    case "TICKET":
    case "BOOKING":
    case "VISA":
    case "INSURANCE":
    case "ITINERARY":
      return <FileText className="h-5 w-5 md:h-6 md:w-6 text-teal" />;
    case "IMAGE":
      return <ImageIcon className="h-5 w-5 md:h-6 md:w-6 text-teal" />;
    case "PASSPORT":
      return <FileText className="h-5 w-5 md:h-6 md:w-6 text-danger" />;
    default:
      return <File className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />;
  }
};

export default async function DocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docs = await getTripDocuments(id);

  return (
    <div className="space-y-5 md:space-y-6 pb-12">
      <TripDocumentCard
        perforation
        title="Documents"
        subtitle="Store and share trip files"
        badge={<DocumentBadge color="coral">✈️ Briefcase</DocumentBadge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className={`border-2 border-border shadow-sticker-sm rounded-xl hidden md:flex`}>
              <Grid className="h-4 w-4" strokeWidth={3} />
            </Button>
            <Button variant="ghost" size="icon" className="border-2 border-transparent hover:border-border hover:bg-secondary rounded-xl transition-all hidden md:flex">
              <ListIcon className="h-4 w-4" strokeWidth={3} />
            </Button>
          </div>
        }
      >
        {/* Search + Upload row */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
            <Input placeholder="Search files..." className={`pl-9 border-2 border-border bg-background shadow-sticker-sm-soft rounded-xl font-bold h-10 text-sm`} />
          </div>
          <AddDocumentModal tripId={id}>
            <Button variant="stickerGreen" className="gap-1.5 h-10 px-4 text-sm">
              <Upload className="h-3.5 w-3.5" strokeWidth={3} />
              <span className="hidden sm:inline">Add Link</span>
            </Button>
          </AddDocumentModal>
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {docs.length === 0 ? (
            <DocumentsEmptyState tripId={id} />
          ) : (
            <>
          {docs.map((doc, i) => (
            <StickerAnimator key={doc.id} delay={i * 0.05}>
              <StickerSurface hoverStrong className="bg-background/50 transition-all group cursor-pointer">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <div className="p-3 md:p-4 flex flex-col gap-2 h-full relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                      <div className={`h-10 w-10 md:h-11 md:w-11 rounded-xl bg-secondary flex items-center justify-center border-2 border-border shadow-sticker-sm-soft group-hover:-translate-y-px transition-transform`}>
                        <FileIcon type={doc.type} />
                      </div>
                    </div>

                    <div className="mt-auto relative z-10 pt-2">
                      <h4 className="font-black text-xs truncate leading-tight mb-0.5" title={doc.name}>{doc.name}</h4>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-secondary/80 w-fit px-1.5 py-0.5 rounded-lg border-2 border-border">
                        <span className="truncate capitalize">{doc.type.toLowerCase()}</span>
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground mt-1 opacity-80">
                        {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })} by {doc.uploaderName}
                      </div>
                    </div>
                  </div>
                </a>
              </StickerSurface>
            </StickerAnimator>
          ))}

          {/* Upload Placeholder */}
          <AddDocumentModal tripId={id}>
            <div className={`border-4 border-dashed border-border bg-secondary/30 rounded-2xl flex flex-col items-center justify-center p-4 gap-2 text-muted-foreground hover:bg-secondary/50 hover:scale-[1.02] transition-all cursor-pointer min-h-[140px] md:min-h-[160px] h-full shadow-sticker-dashed`}>
              <div className={`h-10 w-10 bg-background rounded-full border-2 border-border flex items-center justify-center shadow-sticker-sm-soft`}>
                <Upload className="h-4 w-4 text-foreground" strokeWidth={3} />
              </div>
              <div className="text-center">
                <p className="font-black text-foreground text-xs">Add Document</p>
                <p className="text-[10px] font-bold mt-0.5 opacity-70">Add a link</p>
              </div>
            </div>
          </AddDocumentModal>
            </>
          )}
        </div>
      </TripDocumentCard>
    </div>
  );
}
