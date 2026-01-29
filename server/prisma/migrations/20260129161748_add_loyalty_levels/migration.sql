-- CreateTable
CREATE TABLE "LoyaltyLevel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "minPoints" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "badgeColor" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoyaltyLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyLevel_name_key" ON "LoyaltyLevel"("name");
