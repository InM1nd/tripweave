import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error(
            "Missing CLERK_WEBHOOK_SECRET. Add it to .env.local from Clerk Dashboard → Webhooks."
        );
    }

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return NextResponse.json(
            { error: "Missing svix headers" },
            { status: 400 }
        );
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Webhook verification failed:", err);
        return NextResponse.json(
            { error: "Webhook verification failed" },
            { status: 400 }
        );
    }

    // Handle events
    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        const email = email_addresses[0]?.email_address;
        const name = [first_name, last_name].filter(Boolean).join(" ") || "User";

        await prisma.user.upsert({
            where: { clerkId: id },
            update: {
                email,
                name,
                avatar: image_url,
            },
            create: {
                clerkId: id,
                email,
                name,
                avatar: image_url,
            },
        });

        console.log(`[Clerk Webhook] User ${eventType}: ${id} (${email})`);
    }

    if (eventType === "user.deleted") {
        const { id } = evt.data;

        if (id) {
            await prisma.user.delete({
                where: { clerkId: id },
            }).catch(() => {
                // User might not exist in DB yet
                console.log(`[Clerk Webhook] User not found for deletion: ${id}`);
            });

            console.log(`[Clerk Webhook] User deleted: ${id}`);
        }
    }

    return NextResponse.json({ success: true });
}
