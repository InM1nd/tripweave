import { getTripDocuments } from "@/actions/document";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      {/* Header */}
      <div className="flex flex-col gap-3 border-b-2 border-border pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="bg-sticker-coral text-white px-3 py-1 rounded-full font-black text-xs border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.08)] inline-block mb-2 rotate-1">
              ✈️ Briefcase
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-[0.9]">Documents</h2>
            <p className="text-muted-foreground font-bold text-sm mt-1">Store and share trip files</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon" className="border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.08)] rounded-xl">
              <Grid className="h-4 w-4" strokeWidth={3} />
            </Button>
            <Button variant="ghost" size="icon" className="border-2 border-transparent hover:border-border hover:bg-secondary rounded-xl transition-all">
              <ListIcon className="h-4 w-4" strokeWidth={3} />
            </Button>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
            <Input placeholder="Search files..." className="pl-9 border-2 border-border bg-card shadow-[0_2px_0_rgba(0,0,0,0.06)] rounded-xl font-bold h-10 text-sm" />
          </div>
          <AddDocumentModal tripId={id}>
            <Button className="gap-1.5 font-bold border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.1)] hover:-translate-y-px transition-all rounded-xl bg-sticker-green text-foreground hover:bg-sticker-green/90 h-10 px-4 text-sm">
              <Upload className="h-3.5 w-3.5" strokeWidth={3} />
              <span className="hidden sm:inline">Add Link</span>
            </Button>
          </AddDocumentModal>
        </div>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {docs.map((doc) => (
          <Card key={doc.id} className="border-2 border-border bg-card shadow-[0_4px_0_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(0,0,0,0.12)] transition-all group cursor-pointer rounded-2xl">
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="block h-full">
              <CardContent className="p-3 md:p-4 flex flex-col gap-2 h-full relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <div className="h-10 w-10 md:h-11 md:w-11 rounded-xl bg-secondary flex items-center justify-center border-2 border-border shadow-[0_2px_0_rgba(0,0,0,0.06)] group-hover:-translate-y-px transition-transform">
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
              </CardContent>
            </a>
          </Card>
        ))}

        {/* Upload Placeholder */}
        <AddDocumentModal tripId={id}>
          <div className="border-4 border-dashed border-border bg-secondary/30 rounded-2xl flex flex-col items-center justify-center p-4 gap-2 text-muted-foreground hover:bg-secondary/50 hover:scale-[1.02] transition-all cursor-pointer min-h-[140px] md:min-h-[160px] h-full shadow-[0_4px_0_rgba(0,0,0,0.04)]">
            <div className="h-10 w-10 bg-background rounded-full border-2 border-border flex items-center justify-center shadow-[0_2px_0_rgba(0,0,0,0.06)]">
              <Upload className="h-4 w-4 text-foreground" strokeWidth={3} />
            </div>
            <div className="text-center">
              <p className="font-black text-foreground text-xs">Add Document</p>
              <p className="text-[10px] font-bold mt-0.5 opacity-70">Add a link</p>
            </div>
          </div>
        </AddDocumentModal>
      </div>
    </div>
  );
}
