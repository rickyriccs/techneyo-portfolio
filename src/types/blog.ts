export type BlogStatus = "Published" | "Draft" | "Archived";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  cover_image?: string | null;
  author_name: string;
  author_role: string;
  reading_time: string;
  status: BlogStatus;
  is_featured: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  cover_image: string;
  author_name: string;
  author_role: string;
  reading_time: string;
  status: BlogStatus;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
}

export const BLOG_CATEGORIES = [
  "All",
  "Web Development",
  "SEO & Growth",
  "Automation",
  "CRM & Tools",
  "Business Insights",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
