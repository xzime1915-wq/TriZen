PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Product" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "longDescription" TEXT NOT NULL DEFAULT '',
  "features" TEXT NOT NULL DEFAULT '[]',
  "specifications" TEXT NOT NULL DEFAULT '[]',
  "galleryImages" TEXT NOT NULL DEFAULT '[]',
  "colors" TEXT NOT NULL DEFAULT '[]',
  "sku" TEXT NOT NULL,
  "barcode" TEXT NOT NULL,
  "tag" TEXT,
  "price" REAL NOT NULL,
  "cost_price" REAL NOT NULL DEFAULT 0,
  "compareAt" REAL,
  "image" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "low_stock_alert" INTEGER NOT NULL DEFAULT 5,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_Product" (
  "id",
  "name",
  "slug",
  "description",
  "longDescription",
  "features",
  "specifications",
  "galleryImages",
  "colors",
  "sku",
  "barcode",
  "tag",
  "price",
  "cost_price",
  "compareAt",
  "image",
  "category",
  "stock",
  "low_stock_alert",
  "featured",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  "name",
  "slug",
  "description",
  "longDescription",
  "features",
  "specifications",
  "galleryImages",
  "colors",
  CASE
    WHEN NULLIF(TRIM("sku"), '') IS NULL OR UPPER(REPLACE(TRIM("sku"), ' ', '-')) LIKE 'TZ-TRIPAD%' THEN
      CASE
        WHEN "slug" LIKE '%v1-black%' THEN 'TS-GP-V1-BLK'
        WHEN "slug" LIKE '%v1-white%' THEN 'TS-GP-V1-WHT'
        WHEN "slug" LIKE '%v2-black%' THEN 'TS-GP-V2-BLK'
        WHEN "slug" LIKE '%v2-white%' THEN 'TS-GP-V2-WHT'
        ELSE 'TS-' || UPPER(REPLACE("slug", 'trizen-', ''))
      END
    ELSE UPPER(REPLACE(TRIM("sku"), ' ', '-'))
  END,
  printf('890%09d', ROW_NUMBER() OVER (ORDER BY "createdAt", "id")),
  "tag",
  "price",
  0,
  "compareAt",
  "image",
  "category",
  "stock",
  5,
  "featured",
  "createdAt",
  "updatedAt"
FROM "Product";

DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";

CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");

PRAGMA foreign_keys=ON;
