"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getInviteDetails, acceptInvite } from "@/actions/invite";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/ui/AuthCard";
import { Loader2, Calendar, MapPin, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface InvitePageProps {
    params: Promise<{
        token: string;
    }>;
}

interface InviteDetails {
    trip: {
        id: string;
        name: string;
        coverImage?: string;
        startDate: string | Date;
        endDate: string | Date;
        destination?: string;
        _count?: { members: number };
    };
}

export default function InvitePage({ params }: InvitePageProps) {
    const { token } = use(params);
    const router = useRouter();
    const [user, setUser] = useState<unknown>(null);
    const [isLoading, setIsLoading] = useState(true); // Loading invite details
    const [isAuthLoading, setIsAuthLoading] = useState(true); // Loading auth state
    const [invite, setInvite] = useState<InviteDetails | null>(null);
    const [isJoining, setIsJoining] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsAuthLoading(false);
        };
        checkUser();
    }, [supabase]);

    useEffect(() => {
        const fetchInvite = async () => {
            try {
                const data = await getInviteDetails(token);
                if (data) {
                    setInvite(data as unknown as InviteDetails);
                }
            } catch (_error) {
                console.error("Failed to fetch invite", _error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvite();
    }, [token]);

    const handleJoin = async () => {
        if (!user) {
            // Redirect to login, then back to this page
            const redirectUrl = `/invite/${token}`;
            router.push(`/login?next=${encodeURIComponent(redirectUrl)}`);
            return;
        }

        try {
            setIsJoining(true);
            const trip = await acceptInvite(token);
            toast.success("You joined the trip!");
            router.push(`/trip/${trip.id}`);
        } catch (_error) {
            toast.error("Failed to join trip");
            console.error(_error);
        } finally {
            setIsJoining(false);
        }
    };

    if (isLoading || isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!invite) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
                <h1 className="text-xl font-black mb-2">Invalid Invite</h1>
                <p className="text-sm text-muted-foreground mb-4">This invite link is invalid or has expired.</p>
                <Button onClick={() => router.push("/dashboard")} className="font-bold border-2 border-border rounded-xl">Go to Dashboard</Button>
            </div>
        );
    }

    const trip = invite.trip;
    const daysDuration = Math.ceil(
        (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <AuthCard>
                {/* Cover Image */}
                <div className="relative h-40 bg-muted">
                    {trip.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={trip.coverImage}
                            alt={trip.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="text-center mb-4">
                        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                            You&apos;ve been invited to
                        </h2>
                        <h1 className="text-2xl md:text-xl font-black text-foreground mb-2">{trip.name}</h1>

                        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground mt-3">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{trip.destination}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{daysDuration} days</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>{trip._count?.members || 1} members</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Button
                            onClick={handleJoin}
                            className="w-full h-10 text-sm font-bold rounded-xl"
                            disabled={isJoining}
                        >
                            {isJoining ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Joining...
                                </>
                            ) : user ? (
                                "Join Trip"
                            ) : (
                                "Sign in to Join"
                            )}
                        </Button>

                        {!user && (
                            <p className="text-[11px] text-center text-muted-foreground">
                                You&apos;ll be redirected to sign in or create an account before joining.
                            </p>
                        )}
                    </div>
                </div>
            </AuthCard>
        </div>
    );
}
