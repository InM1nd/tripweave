"use client";

import { use } from "react";
import TripLayout from "@/components/layout/TripLayout";
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

// Mock documents
const mockDocs = [
  {
    id: "1",
    name: "Flight Tickets.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "Alex",
    date: "2024-03-15",
  },
  {
    id: "2",
    name: "Hotel Reservation.pdf",
    type: "pdf",
    size: "1.1 MB",
    uploadedBy: "Sarah",
    date: "2024-03-16",
  },
  {
    id: "3",
    name: "Itinerary Draft.docx",
    type: "doc",
    size: "540 KB",
    uploadedBy: "Alex",
    date: "2024-03-10",
  },
  {
    id: "4",
    name: "Passport Copies.jpg",
    type: "image",
    size: "3.2 MB",
    uploadedBy: "You",
    date: "2024-03-12",
  },
];

const FileIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-8 w-8 text-red-500" />;
    case "image":
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    case "doc":
      return <FileText className="h-8 w-8 text-blue-600" />;
    default:
      return <File className="h-8 w-8 text-gray-500" />;
  }
};

export default function DocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <TripLayout tripId={id}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Documents</h2>
            <p className="text-muted-foreground">Store and share trip files</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ListIcon className="h-4 w-4" />
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search files..." className="pl-9 max-w-sm border-border/40 bg-card/50" />
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockDocs.map((doc) => (
            <Card key={doc.id} className="border-border/40 bg-card/50 hover:bg-muted/30 transition-colors group cursor-pointer">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-lg bg-background flex items-center justify-center border border-border/40">
                    <FileIcon type={doc.type} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <h4 className="font-medium truncate" title={doc.name}>{doc.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.date}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Added by {doc.uploadedBy}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Upload Placeholder */}
          <div className="border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center p-6 gap-2 text-muted-foreground hover:bg-muted/20 transition-colors cursor-pointer min-h-[180px]">
            <Upload className="h-8 w-8 opacity-50" />
            <p className="font-medium text-sm">Upload File</p>
            <p className="text-xs opacity-70">Drag & drop or click</p>
          </div>
        </div>
      </div>
    </TripLayout>
  );
}
