import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Tag,
  Share2,
  Copy,
  Check,
  Send,
  Linkedin,
  Twitter,
  Sparkles,
  BookOpen,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import PageMeta from "@/components/PageMeta";
import Breadcrumbs from "@/components/Breadcrumbs";
import SeoCta from "@/components/SeoCta";
import { businessInfo } from "@/lib/business-info";
import { organizationSchema, breadcrumbSchema, graphSchema } from "@/lib/schema";
import type { BlogPost } from "@/types/blog";
import { fetchBlogBySlug, fetchPublishedBlogs } from "@/lib/blog-data";

export const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setIsLoading(true);
      const data = await fetchBlogBySlug(slug);
      setPost(data);

      if (data) {
        const all = await fetchPublishedBlogs();
        const related = all
          .filter((p) => p.slug !== slug && (p.category === data.category || p.tags?.some((t) => data.tags?.includes(t))))
          .slice(0, 3);
        setRelatedPosts(related.length ? related : all.filter((p) => p.slug !== slug).slice(0, 3));
      }

      setIsLoading(false);
    };
    load();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="public-premium min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse text-lg text-cyan-300">Loading article...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="public-premium min-h-screen text-white pt-32 pb-20">
        <div className="section-container text-center max-w-xl mx-auto py-16">
          <h1 className="text-3xl font-bold">Article Not Found</h1>
          <p className="mt-3 text-white/60 text-sm">
            The article you are looking for does not exist or has been moved.
          </p>
          <div className="mt-6">
            <Link to="/blog" className="premium-btn premium-btn-primary">
              <ArrowLeft size={16} /> Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const postUrl = `${businessInfo.website}/blog/${post.slug}`;
  const keywordsString = post.tags?.length
    ? post.tags.join(", ")
    : `${post.title}, techneyo blog, web development, digital growth`;

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description || post.excerpt,
    image: post.cover_image || businessInfo.ogImage,
    datePublished: post.created_at || new Date().toISOString(),
    dateModified: post.updated_at || post.created_at || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: post.author_name,
      jobTitle: post.author_role,
    },
    publisher: {
      "@type": "Organization",
      name: businessInfo.name,
      logo: {
        "@type": "ImageObject",
        url: `${businessInfo.website}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  const pageSchema = graphSchema(
    organizationSchema,
    breadcrumbSchema([
      { name: "Home", url: businessInfo.website },
      { name: "Blog", url: `${businessInfo.website}/blog` },
      { name: post.title, url: postUrl },
    ]),
    articleSchema
  );

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setHasCopied(true);
      toast.success("Article link copied!");
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareText = `Read "${post.title}" on Techneyo Solutions:`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n\n👉 ${postUrl}`
  )}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    post.title
  )}&url=${encodeURIComponent(postUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    postUrl
  )}`;

  // Render markdown helper (handles headings, bold, bullet points, links)
  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="font-display text-xl sm:text-2xl font-bold text-white mt-8 mb-3">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="font-display text-2xl sm:text-3xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("- ")) {
        return (
          <li key={idx} className="text-white/80 leading-relaxed ml-5 list-disc my-1">
            {trimmed.replace("- ", "")}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="text-white/80 leading-relaxed ml-5 list-decimal my-1">
            {trimmed.replace(/^\d+\.\s/, "")}
          </li>
        );
      }
      if (trimmed === "") {
        return <div key={idx} className="h-4" />;
      }

      return (
        <p key={idx} className="text-white/80 text-sm sm:text-base leading-relaxed my-3">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="public-premium min-h-screen overflow-hidden text-white">
      <PageMeta
        title={post.seo_title || `${post.title} | Techneyo Blog`}
        description={post.seo_description || post.excerpt}
        keywords={keywordsString}
        canonicalPath={`/blog/${post.slug}`}
        ogImage={post.cover_image || businessInfo.ogImage}
        schema={pageSchema}
      />

      {/* Article Hero */}
      <section className="relative pt-32 pb-10 overflow-hidden">
        <div className="premium-grid-bg" />
        <div className="premium-orbit premium-orbit-a" />
        <div className="section-container relative z-10 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: "Home", path: "/" },
              { label: "Blog", path: "/blog" },
              { label: post.title, path: `/blog/${post.slug}` },
            ]}
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 text-xs font-semibold text-cyan-300">
                {post.category}
              </span>
              <span className="text-xs text-white/50 flex items-center gap-1">
                <Clock size={12} /> {post.reading_time}
              </span>
              <span className="text-xs text-white/50 flex items-center gap-1">
                <Calendar size={12} />
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recent"}
              </span>
            </div>

            {/* Social Share Pills */}
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1 backdrop-blur-md">
              <span className="text-xs text-white/50 flex items-center gap-1">
                <Share2 size={12} /> Share:
              </span>
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="text-white/70 hover:text-emerald-400 transition-colors p-1"
                title="Share on WhatsApp"
              >
                <Send size={13} />
              </a>
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="text-white/70 hover:text-cyan-400 transition-colors p-1"
                title="Share on X"
              >
                <Twitter size={13} />
              </a>
              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="text-white/70 hover:text-blue-400 transition-colors p-1"
                title="Share on LinkedIn"
              >
                <Linkedin size={13} />
              </a>
              <button
                onClick={copyShareLink}
                aria-label="Copy link"
                className="text-white/70 hover:text-amber-300 transition-colors p-1"
                title="Copy Link"
              >
                {hasCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight text-white mt-6">
            {post.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/10 text-xs text-white/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              {post.author_name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-white">{post.author_name}</p>
              <p className="text-[11px] text-white/50">{post.author_role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="section-container max-w-4xl pb-8">
          <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full max-h-[460px] object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content & Side CTAs */}
      <section className="section-container max-w-4xl py-6">
        <article className="rounded-3xl border border-white/10 bg-white/[0.015] p-6 sm:p-10 backdrop-blur-xl">
          <div className="prose prose-invert max-w-none">
            {renderMarkdown(post.content)}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Tag size={14} /> Related Topics:
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t, idx) => (
                  <Link
                    key={idx}
                    to={`/blog?tag=${encodeURIComponent(t)}`}
                    className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full border border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-white/75 hover:text-white transition-all"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* In-Article Promotional Offer Bridge */}
        <div className="mt-10 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-neutral-900/60 to-slate-950/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="premium-badge">Featured Growth Plan</span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
              Ready to launch your business online for ₹999/month?
            </h3>
            <p className="text-xs sm:text-sm text-white/70">
              Managed hosting, responsive UI, local SEO setup, and WhatsApp booking included.
            </p>
          </div>
          <Link
            to="/offers/business-website-starting-999-month"
            className="premium-btn premium-btn-primary shrink-0 text-xs px-5 py-3 flex items-center gap-2"
          >
            <Sparkles size={16} /> View ₹999 Offer
          </Link>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/10">
            <h3 className="font-display text-2xl font-bold text-white mb-6">
              You Might Also Like
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((r) => (
                <Link
                  key={r.id}
                  to={`/blog/${r.slug}`}
                  className="premium-card premium-card-hover p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[11px] text-cyan-300 font-semibold uppercase tracking-wider block mb-2">
                      {r.category}
                    </span>
                    <h4 className="font-display text-base font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
                      {r.title}
                    </h4>
                    <p className="text-xs text-white/60 mt-2 line-clamp-2">{r.excerpt}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300">
                    Read article <ChevronRight size={13} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14">
          <SeoCta title="Have questions about web architecture or digital automation?" />
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
