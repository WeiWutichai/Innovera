-- CreateTable
CREATE TABLE IF NOT EXISTS "LineUser" (
    "id" TEXT NOT NULL,
    "lineUserId" TEXT NOT NULL,
    "displayName" TEXT,
    "pictureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LineUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable (join table for many-to-many)
CREATE TABLE IF NOT EXISTS "_ProductLineUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductLineUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
DO $$ BEGIN
    CREATE UNIQUE INDEX "LineUser_lineUserId_key" ON "LineUser"("lineUserId");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateIndex
DO $$ BEGIN
    CREATE INDEX "_ProductLineUsers_B_index" ON "_ProductLineUsers"("B");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "_ProductLineUsers" ADD CONSTRAINT "_ProductLineUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "LineUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "_ProductLineUsers" ADD CONSTRAINT "_ProductLineUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
