"use client";

import * as React from "react";
import { Palette, Paintbrush } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PaletteToggle() {
    const [, setPalette] = React.useState<string>("default");
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        const currentPalette = document.documentElement.getAttribute("data-palette") || "default";
        setPalette(currentPalette);
    }, []);

    const handleSetPalette = (newPalette: string) => {
        setPalette(newPalette);
        if (newPalette === "default") {
            document.documentElement.removeAttribute("data-palette");
        } else {
            document.documentElement.setAttribute("data-palette", newPalette);
        }
        try {
            localStorage.setItem("palette", newPalette);
        } catch {
            // ignore localStorage errors
        }
    };

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
                <Palette className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
                    <Palette className="h-4 w-4" />
                    <span className="sr-only">Toggle color palette</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSetPalette("default")} className="gap-2">
                    <Paintbrush className="h-4 w-4 text-[#FF8A3C]" />
                    <span>Papaya Mango</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetPalette("alternate")} className="gap-2">
                    <Paintbrush className="h-4 w-4 text-[#3B82F6]" />
                    <span>Cool Blue</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
