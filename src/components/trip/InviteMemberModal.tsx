"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserPlus, Copy, Check, Mail, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { inviteToTrip, createPublicInvite } from "@/actions/invite";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const inviteSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["MEMBER", "ADMIN"]),
});

type InviteValues = z.infer<typeof inviteSchema>;

interface InviteMemberModalProps {
    tripId: string;
}

export function InviteMemberModal({ tripId }: InviteMemberModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const form = useForm<InviteValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            email: "",
            role: "MEMBER",
        },
    });

    async function onSubmit(data: InviteValues) {
        setIsPending(true);
        try {
            const invite = await inviteToTrip(tripId, data.email, data.role);
            // Email invites are sent via email service (simulated here)
            // But if we want to show a link for email invite too, we can
            // const link = `${window.location.origin}/invite/${invite.token}`;
            // setInviteLink(link);
            toast.success("Invite sent successfully!");
            form.reset();
            setOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to send invite");
        } finally {
            setIsPending(false);
        }
    }

    async function handleGenerateLink() {
        setIsPending(true);
        try {
            const invite = await createPublicInvite(tripId, "MEMBER");
            const link = `${window.location.origin}/invite/${invite.token}`;
            setInviteLink(link);
            toast.success("Public link generated!");
        } catch (error: any) {
            toast.error(error.message || "Failed to generate link");
        } finally {
            setIsPending(false);
        }
    }

    function handleCopy() {
        if (inviteLink) {
            navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }
    }

    function handleOpenChange(value: boolean) {
        setOpen(value);
        if (!value) {
            setInviteLink(null);
            setCopied(false);
            form.reset();
        }
    }

    const FormContent = (
        <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="link">Link</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="friend@example.com"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="MEMBER">Member</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full gap-2" disabled={isPending}>
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Mail className="h-4 w-4" />
                            )}
                            Send Invite
                        </Button>
                    </form>
                </Form>
            </TabsContent>

            <TabsContent value="link" className="space-y-4 px-1">
                <div className="text-sm text-muted-foreground mb-4">
                    Anyone with this link can join as a member to this trip.
                </div>

                {!inviteLink ? (
                    <Button
                        onClick={handleGenerateLink}
                        className="w-full gap-2"
                        variant="secondary"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <LinkIcon className="h-4 w-4" />
                        )}
                        Generate Link
                    </Button>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Input
                                value={inviteLink}
                                readOnly
                                className="font-mono text-xs"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                                className="shrink-0"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Link expires in 30 days.
                        </p>
                    </div>
                )}
            </TabsContent>
        </Tabs>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button className="gap-2" size="sm">
                        <UserPlus className="h-4 w-4" />
                        <span className="hidden sm:inline">Invite</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[440px]">
                    <DialogHeader>
                        <DialogTitle>Invite People</DialogTitle>
                        <DialogDescription>
                            Invite friends to join your trip via email or link.
                        </DialogDescription>
                    </DialogHeader>
                    {FormContent}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>
                <Button className="gap-2" size="sm">
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Invite</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Invite People</DrawerTitle>
                    <DrawerDescription>
                        Invite friends to join your trip via email or link.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-8">
                    {FormContent}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
