-- Add homeId temporarily nullable
ALTER TABLE "Bill"
ADD COLUMN "homeId" TEXT;

-- Copy homeId from Meter -> Home relation
UPDATE "Bill"
SET "homeId" = "Meter"."homeId"
FROM "Meter"
WHERE "Bill"."meterId" = "Meter"."id";

-- Make homeId required
ALTER TABLE "Bill"
ALTER COLUMN "homeId" SET NOT NULL;

-- Add foreign key
ALTER TABLE "Bill"
ADD CONSTRAINT "Bill_homeId_fkey"
FOREIGN KEY ("homeId")
REFERENCES "Home"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Remove old foreign key
ALTER TABLE "Bill"
DROP CONSTRAINT "Bill_meterId_fkey";

-- Drop meterId column
ALTER TABLE "Bill"
DROP COLUMN "meterId";

-- Drop Meter table
DROP TABLE "Meter";