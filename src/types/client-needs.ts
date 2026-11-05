export type UrgencyLevel = "Critical" | "Moderate" | "Optimization";

export type UrgencyScore = {
  score: number; // 0 - 100
  level: UrgencyLevel;
  badgeText: string;
  badgeColor: string;
  summary: string;
};

export interface QuizIndustry {
  id: string;
  name: string;
  iconName: string;
  description: string;
  statHighlight: string;
  benchmarkHint: string;
}

export interface QuizBottleneck {
  id: string;
  title: string;
  description: string;
  urgencyLevel: UrgencyLevel;
  urgencyWeight: number; // 15 to 40
  industryHints?: Record<string, string>; // Specific hint based on industry
  defaultHint: string;
  recommendedCategory: "Website Presence" | "Business Tool" | "Digital Growth" | "Automation";
}

export interface QuizDigitalStatus {
  id: string;
  title: string;
  description: string;
  urgencyWeight: number;
  hint: string;
}

export interface QuizTimeline {
  id: string;
  title: string;
  timeframe: string;
  urgencyWeight: number;
  badge: string;
}

export interface ClientNeedsAssessment {
  id: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  business_name?: string | null;
  industry: string;
  industry_name?: string | null;
  bottleneck: string;
  bottleneck_title?: string | null;
  digital_status: string;
  timeline: string;
  urgency_score: number;
  urgency_level: UrgencyLevel;
  recommended_offer_id?: string | null;
  status: "New" | "Contacted" | "Proposal Sent" | "Converted";
  answers?: Record<string, any> | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}
