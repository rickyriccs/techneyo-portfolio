import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Tag,
  Sparkles,
  Calendar,
  X,
  SlidersHorizontal,
  ChevronRight,
  Layers,
} from "lucide-react";
import PageMeta from "@/components/PageMeta";
import SeoCta from "@/components/SeoCta";
import { businessInfo } from "@/lib/business-info";
import { organizationSchema, breadcrumbSchema, graphSchema } from "@/lib/schema";
import type { BlogPost, BlogCategory } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/types/blog";
import { fetchPublishedBlogs } from "@/lib/blog-data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" as const },
  }),
};

export const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = (searchParams.get("category") as BlogCategory) || "All";
  const activeTag = searchParams.get("tag");
  const searchQuery = searchParams.get("search") || "";
  const sortOrder = searchParams.get("sort") || "latest";

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchPublishedBlogs();
      setBlogs(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleCategorySelect = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === "All") {
      next.delete("category");
    } else {
      next.set("category", cat);
    }
    setSearchParams(next);
  };

  const handleSearchChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val.trim() === "") {
      next.delete("search");
    } else {
      next.set("search", val);
    }
    setSearchParams(next);
  };

  const handleSortChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val === "latest") {
      next.delete("sort");
    } else {
      next.set("sort", val);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const filteredBlogs = useMemo(() => {
    let list = [...blogs];

    // Category
    if (activeCategory !== "All") {
      list = list.filter((b) => b.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Tag
    if (activeTag) {
      const lowerTag = activeTag.toLowerCase();
      list = list.filter((b) => b.tags?.some((t) => t.toLowerCase().includes(lowerTag)));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((b) => {
        return (
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q) ||
          b.tags?.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    // Sorting
    if (sortOrder === "oldest") {
      list.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
    } else if (sortOrder === "quick") {
      list.sort((a, b) => {
        const getMins = (str: string) => parseInt(str) || 5;
        return getMins(a.reading_time) - getMins(b.reading_time);
      });
    } else {
      // Latest
      list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    return list;
  }, [blogs, activeCategory, activeTag, searchQuery, sortOrder]);

  const featuredBlog = useMemo(() => {
    if (activeCategory !== "All" || activeTag || searchQuery) return null;
    return blogs.find((b) => b.is_featured) || blogs[0] || null;
  }, [blogs, activeCategory, activeTag, searchQuery]);

  const gridBlogs = useMemo(() => {
    if (featuredBlog && activeCategory === "All" && !activeTag && !searchQuery) {
      return filteredBlogs.filter((b) => b.id !== featuredBlog.id);
    }
    return filteredBlogs;
  }, [filteredBlogs, featuredBlog, activeCategory, activeTag, searchQuery]);

  // Schema
  const pageSchema = graphSchema(
    organizationSchema,
    breadcrumbSchema([
      { name: "Home", url: businessInfo.website },
      { name: "Blog", url: `${businessInfo.website}/blog` },
    ])
  );

  return (
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta
        title={
          activeTag
            ? `#${activeTag} Articles & Guides | Techneyo Solutions Blog`
            : activeCategory !== "All"
            ? `${activeCategory} Insights & Guides | Techneyo Solutions Blog`
            : "Tech & Digital Growth Blog | Techneyo Solutions"
        }
        description="Explore actionable articles, tutorials, and practical insights on website development, local SEO, WhatsApp automation, and custom business tools."
        keywords="techneyo blog, web development articles, local seo guide, business automation tips, small business tech insights"
        canonicalPath="/blog"
        schema={pageSchema}
      />

      {/* Hero Header */}
      <section className="premium-hero relative overflow-hidden pb-12 pt-32">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10 max-w-4xl">
          <motion.div initial="hidden" animate="visible">
            <motion.p variants={fadeUp} custom={0} className="premium-eyebrow">
              Knowledge Hub & Engineering Insights
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl sm:text-6xl font-bold leading-tight text-white mt-2"
            >
              Practical insights to build, rank, and automate your business.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-5 text-base sm:text-lg leading-relaxed text-white/70 max-w-2xl"
            >
              Engineering guides, conversion case studies, and modern growth strategies crafted for
              founders, small businesses, and enterprise teams.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Blog Highlight (When no specific search/filter is applied) */}
      {featuredBlog && !isLoading && (
        <section className="pb-10">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 sm:p-10 backdrop-blur-xl shadow-2xl hover:border-cyan-400/40 transition-all group"
            >
              <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-cyan-500/15 blur-[100px]" />

              <div className="grid gap-8 lg:grid-cols-12 items-center relative z-10">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-300">
                      ★ Featured Article
                    </span>
                    <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                      {featuredBlog.category}
                    </span>
                    <span className="text-xs text-white/50 flex items-center gap-1">
                      <Clock size={12} /> {featuredBlog.reading_time}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-4xl font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                    <Link to={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                  </h2>

                  <p className="text-sm sm:text-base text-white/70 leading-relaxed line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span>By {featuredBlog.author_name}</span>
                      <span>•</span>
                      <span>
                        {featuredBlog.created_at
                          ? new Date(featuredBlog.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recent"}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${featuredBlog.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-300 hover:text-white transition-colors"
                    >
                      Read Full Article <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {featuredBlog.cover_image && (
                  <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                    <img
                      src={featuredBlog.cover_image}
                      alt={featuredBlog.title}
                      className="w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Advanced Multi-Dimensional Filter Bar */}
      <section className="py-6 border-t border-b border-white/10 bg-white/[0.015] sticky top-16 md:top-20 z-20 backdrop-blur-xl">
        <div className="section-container space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search articles, keywords, tags..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 py-2 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:bg-white/10 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Pills (Horizontal Scrolling) */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {BLOG_CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20"
                        : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <SlidersHorizontal size={14} className="text-white/50" />
              <select
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-lg border border-white/15 bg-neutral-900 px-3 py-1.5 text-xs text-white/80 focus:border-cyan-400 focus:outline-none"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="quick">Short Reads</option>
              </select>
            </div>
          </div>

          {/* Active Tag Filter Pill */}
          {activeTag && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/50">Filtered by tag:</span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-cyan-300 font-medium">
                <Tag size={12} /> #{activeTag}
                <button
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete("tag");
                    setSearchParams(next);
                  }}
                  className="hover:text-white ml-0.5"
                >
                  <X size={13} />
                </button>
              </span>
              <button
                onClick={clearAllFilters}
                className="text-white/50 hover:text-white underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Blog Grid */}
      <section className="premium-section py-14">
        <div className="section-container">
          {isLoading ? (
            <div className="py-20 text-center text-cyan-300 animate-pulse">Loading articles...</div>
          ) : gridBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 rounded-2xl border border-white/10 bg-white/[0.01] max-w-xl mx-auto">
              <BookOpen size={36} className="text-white/40 mb-3" />
              <p className="text-white/70 text-lg font-medium">No matching articles found.</p>
              <p className="text-white/40 text-xs mt-1">
                Try searching for different keywords or clearing active filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="premium-btn premium-btn-primary mt-6 text-xs px-5 py-2.5"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {gridBlogs.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={fadeUp}
                  custom={idx}
                  className="premium-card premium-card-hover flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md overflow-hidden group"
                >
                  {/* Card Cover Image */}
                  {post.cover_image && (
                    <div className="overflow-hidden rounded-xl h-44 mb-4 border border-white/10 relative">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 rounded-md bg-neutral-950/80 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-cyan-300">
                        {post.category}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recent"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.reading_time}
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-white/65 leading-relaxed line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                      {post.tags.slice(0, 3).map((t, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const next = new URLSearchParams(searchParams);
                            next.set("tag", t);
                            setSearchParams(next);
                          }}
                          className="text-[11px] font-medium px-2 py-0.5 rounded border border-white/10 bg-white/5 text-white/60 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action Link */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/50">{post.author_name}</span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="font-semibold text-cyan-300 hover:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Read Guide <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="mt-16">
            <SeoCta title="Need custom software, website design or SEO engineering for your business?" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
