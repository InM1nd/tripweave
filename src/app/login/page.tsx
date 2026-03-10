"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/ui/AuthCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plane } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/dashboard";

    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(searchParams.get("signup") === "true");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
                },
            });
            if (error) throw error;
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Google auth failed");
            setIsLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
                    },
                });
                if (error) throw error;
                toast.success("Check your email to confirm your account!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Logged in successfully!");
                router.push(next);
                router.refresh();
            }
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4">
            <AuthCard className="space-y-6 p-6 md:p-5">
                <div className="flex flex-col items-center justify-center text-center space-y-1.5">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-3 border-2 border-border shadow-sticker-card">
                        <Plane className="h-5 w-5" strokeWidth={3} />
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight">
                        {isSignUp ? "Create an account" : "Welcome back"}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        {isSignUp
                            ? "Enter your email below to create your account"
                            : "Enter your email below to log in to your account"}
                    </p>
                </div>

                <div className="space-y-3">
                    <Button type="button" variant="outline" className="w-full h-10 text-sm font-bold border-2 border-border rounded-xl" onClick={handleGoogleLogin} disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                        )}
                        Sign in with Google
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleAuth} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="h-10"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="h-10"
                        />
                    </div>

                    <Button type="submit" className="w-full h-10 text-sm font-bold rounded-xl" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </Button>
                </form>

                <div className="text-center text-xs">
                    <span className="text-muted-foreground">
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary hover:underline font-bold"
                        disabled={isLoading}
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </div>
            </AuthCard>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-[100dvh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
