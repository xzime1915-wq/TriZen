"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { formatCurrency } from "@/lib/utils";
import {
  parseFeatures,
  parseSpecs,
  parseGallery,
  parseColors,
  featuresToLines,
  specsToLines,
  galleryToLines,
  colorsToLines,
} from "@/lib/product-data";
import { buildProductDbPayload } from "@/lib/admin-product-payload";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  features: string;
  specifications: string;
  galleryImages: string;
  colors: string;
  sku: string | null;
  tag: string | null;
  price: number;
  compareAt: number | null;
  image: string;
  category: string;
  stock: number;
  featured: boolean;
};

const emptyForm = {
  name: "",
  description: "",
  longDescription: "",
  featuresText: "",
  specificationsText: "",
  galleryText: "",
  colorsText: "",
  sku: "",
  tag: "",
  price: "",
  compareAt: "",
  image: "/products/",
  category: "Mouse Pads",
  stock: "10",
  featured: true,
};

function productToForm(p: Product) {
  const gallery = parseGallery(p.galleryImages, p.image);
  const colors = parseColors(p.colors);
  return {
    name: p.name,
    description: p.description,
    longDescription: p.longDescription || p.description,
    featuresText: featuresToLines(parseFeatures(p.features)),
    specificationsText: specsToLines(parseSpecs(p.specifications)),
    galleryText: galleryToLines(gallery),
    colorsText: colorsToLines(colors),
    sku: p.sku || "",
    tag: p.tag || "",
    price: String(p.price),
    compareAt: p.compareAt ? String(p.compareAt) : "",
    image: p.image,
    category: p.category,
    stock: String(p.stock),
    featured: p.featured,
  };
}

export function ProductManager({ products }: { products: Product[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function startAdd() {
    setMode("add");
    setEditId(null);
    setForm(emptyForm);
  }

  function startEdit(product: Product) {
    setMode("edit");
    setEditId(product.id);
    setForm(productToForm(product));
  }

  function cancel() {
    setMode(null);
    setEditId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = buildProductDbPayload({
      name: form.name,
      description: form.description,
      longDescription: form.longDescription,
      featuresText: form.featuresText,
      specificationsText: form.specificationsText,
      galleryText: form.galleryText || form.image,
      colorsText: form.colorsText,
      sku: form.sku,
      tag: form.tag,
      price: parseFloat(form.price),
      compareAt: form.compareAt ? parseFloat(form.compareAt) : null,
      image: form.image,
      category: form.category,
      stock: parseInt(form.stock, 10),
      featured: form.featured,
    });

    const res =
      mode === "edit" && editId
        ? await fetch(`/api/admin/products/${editId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

    setLoading(false);
    if (res.ok) {
      cancel();
      router.refresh();
    }
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <Button onClick={startAdd} size="sm">
        <Plus className="h-4 w-4 mr-1" /> Add Product
      </Button>

      {mode && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 border border-[var(--color-border)] p-6 grid sm:grid-cols-2 gap-4 bg-[var(--color-surface-elevated)] max-h-[80vh] overflow-y-auto"
        >
          <p className="sm:col-span-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
            {mode === "edit" ? "Edit Product" : "New Product"}
          </p>
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Category"
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Input
            label="Price (Taka)"
            type="number"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Input
            label="Compare At (optional)"
            type="number"
            step="0.01"
            value={form.compareAt}
            onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
          />
          <Input
            label="Stock"
            type="number"
            required
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <Input
            label="SKU (optional)"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
          <Input
            label="Tag (e.g. Hot)"
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
          />
          <Input
            label="Main image path"
            required
            className="sm:col-span-2"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Short description (shop & summary)"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Full description (Description tab)"
              value={form.longDescription}
              onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Features (one per line)"
              value={form.featuresText}
              onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
              placeholder="Ultra smooth glass surface&#10;Low friction glide"
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Specifications (Label | Value per line)"
              value={form.specificationsText}
              onChange={(e) => setForm({ ...form, specificationsText: e.target.value })}
              placeholder="Material | Tempered glass&#10;Size | 400 × 450 mm"
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Product photo gallery (one image path per line, thumbnails below main photo)"
              value={form.galleryText}
              onChange={(e) => setForm({ ...form, galleryText: e.target.value })}
              placeholder={"/products/photo-1.png\n/products/photo-2.png\n/products/photo-3.png"}
            />
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Add as many product photos as you want. These are not tied to color options.
            </p>
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Options for checkout only (one name per line, optional)"
              value={form.colorsText}
              onChange={(e) => setForm({ ...form, colorsText: e.target.value })}
              placeholder={"Size L\nSize XL"}
            />
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Text buttons only (e.g. size/variant). Leave empty if not needed.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Show on homepage
          </label>
          <div className="sm:col-span-2 flex gap-3 sticky bottom-0 bg-[var(--color-surface-elevated)] pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Product"}
            </Button>
            <Button type="button" variant="ghost" onClick={cancel}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="mt-10 border border-[var(--color-border)] overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-zinc-100 text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-[var(--color-border)]">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-[var(--color-muted)]">{p.category}</td>
                <td className="p-3">{formatCurrency(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(p.id, p.name)}
                      className="text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-[var(--color-muted)]">No products yet.</p>
        )}
      </div>
    </div>
  );
}
