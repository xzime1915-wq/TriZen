import {
  featuresFromLines,
  specsFromLines,
  galleryFromLines,
  colorsFromLines,
  stringifyJsonField,
} from "./product-data";
import { generateSku, normalizeBarcode, normalizeSku } from "./inventory-codes";

export type AdminProductFormInput = {
  name: string;
  description: string;
  longDescription?: string;
  featuresText?: string;
  specificationsText?: string;
  galleryText?: string;
  colorsText?: string;
  modelCode?: string;
  variantCode?: string;
  sku?: string | null;
  barcode?: string | null;
  tag?: string;
  price: number;
  costPrice?: number;
  compareAt: number | null;
  image: string;
  category: string;
  stock: number;
  lowStockAlert?: number;
  featured: boolean;
  slug?: string;
};

export function buildProductDbPayload(form: AdminProductFormInput) {
  const gallery = galleryFromLines(form.galleryText || form.image);
  const mainImage = gallery[0] || form.image;

  return {
    name: form.name,
    description: form.description,
    longDescription: form.longDescription || form.description,
    features: stringifyJsonField(featuresFromLines(form.featuresText || "")),
    specifications: stringifyJsonField(specsFromLines(form.specificationsText || "")),
    galleryImages: stringifyJsonField(gallery),
    colors: stringifyJsonField(colorsFromLines(form.colorsText || "")),
    sku:
      normalizeSku(form.sku) ||
      generateSku({
        category: form.category,
        name: form.name,
        model: form.modelCode,
        variant: form.variantCode,
      }),
    barcode: normalizeBarcode(form.barcode),
    tag: form.tag?.trim() || null,
    price: form.price,
    costPrice: Number.isFinite(form.costPrice) ? form.costPrice ?? 0 : 0,
    compareAt: form.compareAt,
    image: mainImage,
    category: form.category,
    stock: Number.isFinite(form.stock) ? Math.max(0, Math.floor(form.stock)) : 0,
    lowStockAlert: Number.isFinite(form.lowStockAlert)
      ? Math.max(0, Math.floor(form.lowStockAlert ?? 0))
      : 5,
    featured: form.featured,
    ...(form.slug ? { slug: form.slug } : {}),
  };
}
