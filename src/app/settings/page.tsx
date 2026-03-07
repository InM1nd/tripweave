"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { PaletteToggle } from "@/components/palette-toggle";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6 pt-6 p-4 md:p-0">
                <div>
                    <h1 className="text-xl md:text-2xl font-black">Settings</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your app preferences and settings.
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card className="border-2 border-border rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.08)]">
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize how TripWeave looks on your device.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Theme</Label>
                                    <p className="text-sm text-muted-foreground">Light or dark mode.</p>
                                </div>
                                <ThemeToggle />
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="space-y-0.5">
                                    <Label>Color palette</Label>
                                    <p className="text-sm text-muted-foreground">Papaya Mango or Cool Blue.</p>
                                </div>
                                <PaletteToggle />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
