"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { buildBlogDbPayload, formatBlogDate } from "@/lib/blog";
import { Plus, Pencil, Trash2, Newspaper, Download } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  published: boolean;
  createdAt: string | Date;
};

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "/products/",
  category: "News",
  author: "TRIZEN Store",
  published: true,
};

function postToForm(p: BlogPost) {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    coverImage: p.coverImage || "",
    category: p.category,
    author: p.author,
    published: p.published,
  };
}

export function BlogManager({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);

  async function handleImport() {
    if (!importUrl.trim()) return;
    setImporting(true);
    const res = await fetch("/api/admin/blog/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: importUrl.trim(), category: "Esports" }),
    });
    setImporting(false);

    if (res.ok) {
      const post = await res.json();
      setImportUrl("");
      startEdit({ ...post, createdAt: post.createdAt });
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.error || "Could not import this link");
    }
  }

  function startAdd() {
    setMode("add");
    setEditId(null);
    setForm(emptyForm);
  }

  function startEdit(post: BlogPost) {
    setMode("edit");
    setEditId(post.id);
    setForm(postToForm(post));
  }

  function cancel() {
    setMode(null);
    setEditId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      ...buildBlogDbPayload(form),
      slug: form.slug,
    };

    const res =
      mode === "edit" && editId
        ? await fetch(`/api/admin/blog/${editId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/admin/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

    setLoading(false);
    if (res.ok) {
      cancel();
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.error || "Something went wrong");
    }
  }

  async function deletePost(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={startAdd} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Post
        </Button>
      </div>

      <div className="mt-5 border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
        <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-muted)]">
          <Newspaper className="h-3.5 w-3.5" /> Import news from a link
        </p>
        <p className="mb-3 text-xs text-[var(--color-muted)]">
          Paste a news URL (e.g. a VALORANT esports article). We pull the title,
          summary, and image into a <strong>draft</strong> with a source link —
          review and publish it. (We never copy the full article, that keeps it
          copyright-safe.)
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="flex-1">
            <Input
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="https://valorantesports.com/en-US/news/..."
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleImport}
            disabled={importing || !importUrl.trim()}
          >
            <Download className="h-4 w-4 mr-1" />
            {importing ? "Importing..." : "Import"}
          </Button>
        </div>
      </div>

      {mode && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 border border-[var(--color-border)] p-6 grid sm:grid-cols-2 gap-4 bg-[var(--color-surface-elevated)] max-h-[80vh] overflow-y-auto"
        >
          <p className="sm:col-span-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
            {mode === "edit" ? "Edit Post" : "New Post"}
          </p>
          <Input
            label="Title"
            required
            className="sm:col-span-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Slug (optional, auto from title)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="how-to-choose-a-glass-mouse-pad"
          />
          <Input
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Guide, News, Esports"
          />
          <Input
            label="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          <Input
            label="Cover image path"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            placeholder="/products/tripad-v1-black.png"
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Excerpt (short summary for cards & SEO)"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="A quick 1-2 line summary shown on the blog cards and search results."
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Content (separate paragraphs with a blank line)"
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              placeholder={"First paragraph...\n\nSecond paragraph..."}
            />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published (visible on the site)
          </label>
          <div className="sm:col-span-2 flex gap-3 sticky bottom-0 bg-[var(--color-surface-elevated)] pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Post"}
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
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-[var(--color-border)]">
                <td className="p-3 font-medium">{p.title}</td>
                <td className="p-3 text-[var(--color-muted)]">{p.category}</td>
                <td className="p-3">
                  <span
                    className={
                      p.published
                        ? "text emerald-600"
                        : "text-[var(--color-muted)]"
                    }
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3 text-[var(--color-muted)]">
                  {formatBlogDate(p.createdAt)}
                </td>
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
                      onClick={() => deletePost(p.id, p.title)}
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
        {posts.length === 0 && (
          <p className="p-8 text-center text-[var(--color-muted)]">
            No blog posts yet.
          </p>
        )}
      </div>
    </div>
  );
}
