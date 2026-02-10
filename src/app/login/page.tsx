"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plane } from "lucide-react";
import Link from "next/link";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/dashboard";

    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(searchParams.get("signup") === "true");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const supabase = createClient();

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
        } catch (error: any) {
            toast.error(error.message || "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mb-4">
                        <Plane className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isSignUp ? "Create an account" : "Welcome back"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isSignUp
                            ? "Enter your email below to create your account"
                            : "Enter your email below to log in to your account"}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="h-11"
                        />
                    </div>

                    <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary hover:underline font-medium"
                        disabled={isLoading}
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
