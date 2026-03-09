-- Add isSuggested and placeType to Event (for suggested places from Explore)
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "isSuggested" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "placeType" TEXT;
