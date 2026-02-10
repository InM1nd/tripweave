"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInviteDetails, acceptInvite } from "@/actions/invite";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Trip } from "@/types";

interface InvitePageProps {
    params: {
        token: string;
    };
}

export default function InvitePage({ params }: InvitePageProps) {
    const { token } = params;
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true); // Loading invite details
    const [isAuthLoading, setIsAuthLoading] = useState(true); // Loading auth state
    const [invite, setInvite] = useState<any>(null);
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
                    setInvite(data);
                }
            } catch (error) {
                console.error("Failed to fetch invite", error);
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
        } catch (error) {
            toast.error("Failed to join trip");
            console.error(error);
        } finally {
            setIsJoining(false);
        }
    };

    if (isLoading || isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!invite) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
                <h1 className="text-2xl font-bold mb-2">Invalid Invite</h1>
                <p className="text-muted-foreground mb-4">This invite link is invalid or has expired.</p>
                <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
            </div>
        );
    }

    const trip = invite.trip;
    const daysDuration = Math.ceil(
        (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Cover Image */}
                <div className="relative h-48 bg-gray-200">
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
                <div className="p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                            You've been invited to
                        </h2>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>

                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-4">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{trip.destination}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{daysDuration} days</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mt-2">
                            <Users className="h-4 w-4" />
                            <span>{trip._count?.members || 1} members</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleJoin}
                            className="w-full h-12 text-lg font-semibold"
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
                            <p className="text-xs text-center text-muted-foreground">
                                You'll be redirected to sign in or create an account before joining.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
