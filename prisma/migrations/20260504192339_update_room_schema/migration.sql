/*
  Warnings:

  - You are about to drop the column `amenities` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ref]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "ref" TEXT;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "amenities",
DROP COLUMN "floor",
ADD COLUMN     "hasAV" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priceMax" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "priceMin" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_ref_key" ON "Booking"("ref");
