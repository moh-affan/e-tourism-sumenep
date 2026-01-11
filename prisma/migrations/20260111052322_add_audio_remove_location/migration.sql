/*
  Warnings:

  - You are about to drop the column `location` on the `Collection` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "audioInd" TEXT,
    "audioEng" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Collection" ("category", "createdAt", "description", "id", "image", "name", "updatedAt") SELECT "category", "createdAt", "description", "id", "image", "name", "updatedAt" FROM "Collection";
DROP TABLE "Collection";
ALTER TABLE "new_Collection" RENAME TO "Collection";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
