import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Tag,
  Image as ImageIcon,
  FileText,
  X,
  BookOpen,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { BlogPost, BlogFormData, BlogStatus } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/types/blog";
import { fallbackBlogPosts } from "@/lib/blog-data";

const initialFormState: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Web Development",
  tags: "",
  cover_image: "",
  author_name: "Techneyo Team",
  author_role: "Technical Growth Specialist",
  reading_time: "5 min read",
  status: "Published",
  is_featured: false,
  seo_title: "",
  seo_description: "",
};

export const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormData>(initialFormState);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);

  const loadBlogs = async () => {
    setIsLoading(true);
    if (!supabase) {
      setBlogs(fallbackBlogPosts);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load blogs:", error);
        setBlogs(fallbackBlogPosts);
      } else {
        setBlogs((data || []) as BlogPost[]);
      }
    } catch {
      setBlogs(fallbackBlogPosts);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    setForm((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || editingId === null ? slug : prev.slug,
      seo_title: prev.seo_title === "" ? `${val} | Techneyo Solutions` : prev.seo_title,
    }));
  };

  const handleContentChange = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setForm((prev) => ({
      ...prev,
      content,
      reading_time: `${minutes} min read`,
    }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialFormState);
    setActiveTab("edit");
    setIsModalOpen(true);
  };

  const openEditModal = (blog: BlogPost) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category || "Web Development",
      tags: blog.tags ? blog.tags.join(", ") : "",
      cover_image: blog.cover_image || "",
      author_name: blog.author_name || "Techneyo Team",
      author_role: blog.author_role || "Technical Growth Specialist",
      reading_time: blog.reading_time || "5 min read",
      status: blog.status || "Published",
      is_featured: blog.is_featured || false,
      seo_title: blog.seo_title || "",
      seo_description: blog.seo_description || "",
    });
    setActiveTab("edit");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Please enter a title and slug");
      return;
    }

    setIsSaving(true);
    const tagsArray = form.tags
      ? form.tags.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
      : [];

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      category: form.category,
      tags: tagsArray,
      cover_image: form.cover_image.trim() || null,
      author_name: form.author_name.trim() || "Techneyo Team",
      author_role: form.author_role.trim() || "Technical Growth Specialist",
      reading_time: form.reading_time || "5 min read",
      status: form.status,
      is_featured: form.is_featured,
      seo_title: form.seo_title.trim() || form.title.trim(),
      seo_description: form.seo_description.trim() || form.excerpt.trim(),
    };

    if (!supabase) {
      toast.error("Supabase is not configured. Changes saved to local preview only.");
      setIsSaving(false);
      setIsModalOpen(false);
      return;
    }

    if (editingId) {
      const { error } = await supabase.from("blogs").update(payload).eq("id", editingId);
      if (error) {
        toast.error(`Update failed: ${error.message}`);
      } else {
        toast.success("Blog article updated successfully!");
        setIsModalOpen(false);
        loadBlogs();
      }
    } else {
      const { error } = await supabase.from("blogs").insert([payload]);
      if (error) {
        toast.error(`Creation failed: ${error.message}`);
      } else {
        toast.success("Blog article created successfully!");
        setIsModalOpen(false);
        loadBlogs();
      }
    }
    setIsSaving(false);
  };

  const toggleStatus = async (blog: BlogPost) => {
    if (!supabase) return;
    const newStatus: BlogStatus = blog.status === "Published" ? "Draft" : "Published";
    const { error } = await supabase.from("blogs").update({ status: newStatus }).eq("id", blog.id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Article set to ${newStatus}`);
      loadBlogs();
    }
  };

  const toggleFeatured = async (blog: BlogPost) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("blogs")
      .update({ is_featured: !blog.is_featured })
      .eq("id", blog.id);
    if (error) {
      toast.error("Failed to update featured flag");
    } else {
      toast.success(blog.is_featured ? "Removed from featured" : "Marked as featured!");
      loadBlogs();
    }
  };

  const handleDelete = async (blog: BlogPost) => {
    if (!window.confirm(`Are you sure you want to delete "${blog.title}"?`)) return;
    if (!supabase) return;

    const { error } = await supabase.from("blogs").delete().eq("id", blog.id);
    if (error) {
      toast.error(`Delete failed: ${error.message}`);
    } else {
      toast.success("Blog article deleted");
      loadBlogs();
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    if (filterCategory !== "All" && b.category !== filterCategory) return false;
    if (filterStatus !== "All" && b.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.title.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.tags?.some((t) => t.toLowerCase().includes(q)) ||
        b.excerpt?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Blog Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Publish SEO articles, guides, and customer growth insights with instant reach.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <ExternalLink size={15} /> View Public /blog
          </a>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-md"
          >
            <Plus size={16} /> New Blog Article
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, tag, or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border bg-background py-1.5 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">Status: All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <strong>{filteredBlogs.length}</strong> of {blogs.length} articles
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Article & Slug</th>
                <th className="px-4 py-3.5 font-semibold">Category</th>
                <th className="px-4 py-3.5 font-semibold">Tags</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold">Featured</th>
                <th className="px-4 py-3.5 font-semibold">Date</th>
                <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    Loading articles...
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    No matching articles found.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-start gap-3">
                        {blog.cover_image && (
                          <img
                            src={blog.cover_image}
                            alt=""
                            className="h-10 w-14 rounded object-cover border border-border shrink-0"
                          />
                        )}
                        <div>
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {blog.title}
                          </a>
                          <span className="text-xs text-muted-foreground block font-mono">
                            /blog/{blog.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {blog.category}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {blog.tags && blog.tags.length > 0 ? (
                          blog.tags.slice(0, 2).map((t, idx) => (
                            <span
                              key={idx}
                              className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground"
                            >
                              #{t}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                        {blog.tags && blog.tags.length > 2 && (
                          <span className="text-[11px] text-muted-foreground">
                            +{blog.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => toggleStatus(blog)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition-all ${
                          blog.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20"
                        }`}
                        title="Click to toggle Draft / Published"
                      >
                        {blog.status}
                      </button>
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => toggleFeatured(blog)}
                        className={`text-xs px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                          blog.is_featured
                            ? "bg-amber-500/20 text-amber-700 font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {blog.is_featured ? "★ Featured" : "No"}
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      {blog.created_at
                        ? new Date(blog.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(blog)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Edit article"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog)}
                          className="rounded p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blog Studio Modal / Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {editingId ? "Edit Blog Article" : "Create New Blog Article"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Format in Markdown, configure SEO metadata, and preview before publishing.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-border bg-muted/40 px-6">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                  activeTab === "edit"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Article Editor & Meta
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                  activeTab === "preview"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Live Preview
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {activeTab === "edit" ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Article Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5 Reasons Why Every Small Business in India Needs a Website in 2026"
                        value={form.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">URL Slug *</label>
                      <input
                        type="text"
                        required
                        placeholder="why-every-small-business-needs-website"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {BLOG_CATEGORIES.filter((c) => c !== "All").map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Excerpt / Summary *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="A short punchy summary for cards and search results..."
                        value={form.excerpt}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground">
                          Markdown Body Content *
                        </label>
                        <span className="text-[11px] text-muted-foreground">
                          Supports ## Headings, lists, bold text, quotes, and links
                        </span>
                      </div>
                      <textarea
                        rows={10}
                        required
                        placeholder="## Introduction\n\nWrite your blog content here in markdown..."
                        value={form.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        className="w-full rounded-md border border-border bg-background font-mono text-xs px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Cover Image URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={form.cover_image}
                        onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Target Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="small business, website cost, seo, lead generation"
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Author Name</label>
                      <input
                        type="text"
                        value={form.author_name}
                        onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Author Role</label>
                      <input
                        type="text"
                        value={form.author_role}
                        onChange={(e) => setForm({ ...form, author_role: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Reading Time</label>
                      <input
                        type="text"
                        value={form.reading_time}
                        onChange={(e) => setForm({ ...form, reading_time: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as BlogStatus })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-border">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        SEO Metadata Configuration
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">Custom SEO Title</label>
                          <input
                            type="text"
                            placeholder="Defaults to article title"
                            value={form.seo_title}
                            onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Custom SEO Description
                          </label>
                          <input
                            type="text"
                            placeholder="Defaults to excerpt"
                            value={form.seo_description}
                            onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={form.is_featured}
                        onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                        className="rounded border-border"
                      />
                      <label htmlFor="is_featured" className="text-xs font-semibold text-foreground cursor-pointer">
                        Pin as Featured Article (Highlights at the top of /blog)
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                /* Live Preview Tab */
                <div className="space-y-6 rounded-xl border border-border bg-neutral-950 p-6 text-white">
                  <div className="space-y-2">
                    <span className="rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 text-xs font-semibold">
                      {form.category}
                    </span>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight mt-2">
                      {form.title || "Untitled Article"}
                    </h1>
                    <p className="text-sm text-white/70">{form.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-white/50 pt-2 border-t border-white/10">
                      <span>By {form.author_name}</span>
                      <span>•</span>
                      <span>{form.reading_time}</span>
                    </div>
                  </div>

                  {form.cover_image && (
                    <img
                      src={form.cover_image}
                      alt="Cover"
                      className="w-full h-64 object-cover rounded-xl border border-white/10"
                    />
                  )}

                  <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {form.content || "No body content added yet."}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-md disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingId ? "Update Article" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
