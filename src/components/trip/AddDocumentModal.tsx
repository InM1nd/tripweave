"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Link as LinkIcon, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { FileUpload } from "@/components/ui/file-upload";
import { createDocument } from "@/actions/document";
import { documentSchema, DocumentFormValues } from "@/lib/validations/document";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddDocumentModalProps {
    children?: React.ReactNode;
    tripId: string;
}

export function AddDocumentModal({ children, tripId }: AddDocumentModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("link");
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const router = useRouter();

    const form = useForm<DocumentFormValues>({
        resolver: zodResolver(documentSchema),
        defaultValues: {
            name: "",
            url: "",
            type: "OTHER",
        },
    });

    // Reset form when tab changes
    const onTabChange = (value: string) => {
        setActiveTab(value);
        form.reset();
    };

    async function onSubmit(data: DocumentFormValues) {
        setIsLoading(true);
        try {
            const result = await createDocument(tripId, data);
            if (result.success) {
                toast.success("Document added successfully");
                setOpen(false);
                form.reset();
                router.refresh();
            } else {
                toast.error(result.error || "Failed to add document");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    const FormContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4 md:px-0">
                <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="link">Add Link</TabsTrigger>
                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                    </TabsList>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="mb-4">
                                <FormLabel>Document Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Flight Ticket" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <TabsContent value="link" className="mt-0 space-y-4">
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link URL</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input className="pl-9" placeholder="https://..." {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>

                    <TabsContent value="upload" className="mt-0 space-y-4">
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>File</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            endpoint="documents"
                                            onUploadComplete={(file) => {
                                                if (!form.getValues("name")) {
                                                    form.setValue("name", file.name);
                                                }
                                                form.setValue("fileSize", file.size);
                                                form.setValue("mimeType", file.type);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                </Tabs>

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="TICKET">Ticket</SelectItem>
                                    <SelectItem value="BOOKING">Booking</SelectItem>
                                    <SelectItem value="PASSPORT">Passport</SelectItem>
                                    <SelectItem value="VISA">Visa</SelectItem>
                                    <SelectItem value="INSURANCE">Insurance</SelectItem>
                                    <SelectItem value="ITINERARY">Itinerary</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="pt-4 flex gap-3 justify-end">
                    {!isDesktop && (
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full">Cancel</Button>
                        </DrawerClose>
                    )}
                    {isDesktop && (
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading} className={cn("bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md", !isDesktop && "flex-1")}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {activeTab === "upload" ? "Upload Document" : "Add Link"}
                    </Button>
                </div>
            </form>
        </Form>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children || <Button>Add Document</Button>}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Document</DialogTitle>
                        <DialogDescription>
                            Upload a file or add a link to your important trip documents.
                        </DialogDescription>
                    </DialogHeader>
                    {FormContent}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children || <Button>Add Document</Button>}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Add New Document</DrawerTitle>
                    <DrawerDescription>
                        Upload a file or add a link to your important trip documents.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="pb-8 max-h-[70vh] overflow-y-auto">
                    {FormContent}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
