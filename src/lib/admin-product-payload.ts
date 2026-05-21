import {
  featuresFromLines,
  specsFromLines,
  galleryFromLines,
  colorsFromLines,
  stringifyJsonField,
} from "./product-data";

export type AdminProductFormInput = {
  name: string;
  description: string;
  longDescription?: string;
  featuresText?: string;
  specificationsText?: string;
  galleryText?: string;
  colorsText?: string;
  sku?: string;
  tag?: string;
  price: number;
  compareAt: number | null;
  image: string;
  category: string;
  stock: number;
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
    sku: form.sku?.trim() || null,
    tag: form.tag?.trim() || null,
    price: form.price,
    compareAt: form.compareAt,
    image: mainImage,
    category: form.category,
    stock: form.stock,
    featured: form.featured,
    ...(form.slug ? { slug: form.slug } : {}),
  };
}
