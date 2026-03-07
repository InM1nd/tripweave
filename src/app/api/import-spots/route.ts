import { importSocialSpots, SpotInput } from "@/actions/social-spot-importer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body: SpotInput = await request.json();

        if (!body.url) {
            return NextResponse.json(
                { success: false, error: "URL is required" },
                { status: 400 }
            );
        }

        const result = await importSocialSpots(body);

        return NextResponse.json(result, {
            status: result.success ? 200 : 500,
        });
    } catch (error: unknown) {
        console.error("[API] Social spot import error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
