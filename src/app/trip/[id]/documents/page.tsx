import { getTripDocuments } from "@/actions/document";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Image as ImageIcon,
  Upload,
  Download,
  MoreVertical,
  Search,
  Grid,
  List as ListIcon,
  File
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      return <FileText className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />;
    case "IMAGE":
      return <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />;
    case "PASSPORT":
      return <FileText className="h-6 w-6 md:h-8 md:w-8 text-red-500" />;
    default:
      return <File className="h-6 w-6 md:h-8 md:w-8 text-gray-500" />;
  }
};

export default async function DocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docs = await getTripDocuments(id);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Documents</h2>
            <p className="text-sm md:text-base text-muted-foreground">Store and share trip files</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search files..." className="pl-9 border-border/40 bg-card/50" />
          </div>
          <AddDocumentModal tripId={id}>
            <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all shrink-0">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Add Link</span>
            </Button>
          </AddDocumentModal>
        </div>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {docs.map((doc) => (
          <Card key={doc.id} className="border-border/40 bg-card/50 hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => {/* Handle click to open link */ }}>
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="block h-full">
              <CardContent className="p-3 md:p-4 flex flex-col gap-2 md:gap-3 h-full">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-background flex items-center justify-center border border-border/40">
                    <FileIcon type={doc.type} />
                  </div>
                  {/* Dropdown actions could be added here if needed */}
                </div>

                <div className="mt-auto">
                  <h4 className="font-medium text-xs md:text-sm truncate" title={doc.name}>{doc.name}</h4>
                  <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-muted-foreground mt-1">
                    <span className="truncate capitalize">{doc.type.toLowerCase()}</span>
                    <span>•</span>
                    <span className="truncate">{formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                    by {doc.uploaderName}
                  </div>
                </div>
              </CardContent>
            </a>
          </Card>
        ))}

        {/* Upload Placeholder */}
        <AddDocumentModal tripId={id}>
          <div className="border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center p-4 md:p-6 gap-1.5 md:gap-2 text-muted-foreground hover:bg-muted/20 transition-colors cursor-pointer min-h-[140px] md:min-h-[180px] h-full">
            <Upload className="h-6 w-6 md:h-8 md:w-8 opacity-50" />
            <p className="font-medium text-xs md:text-sm">Add Document</p>
            <p className="text-[10px] md:text-xs opacity-70">Add a link</p>
          </div>
        </AddDocumentModal>
      </div>
    </div>
  );
}
