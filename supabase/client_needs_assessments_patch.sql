-- Migration: Create client_needs_assessments table in Supabase PostgreSQL
-- Date: 2026-11-05

CREATE TABLE IF NOT EXISTS public.client_needs_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  business_name TEXT,
  industry TEXT NOT NULL,
  industry_name TEXT,
  bottleneck TEXT NOT NULL,
  bottleneck_title TEXT,
  digital_status TEXT NOT NULL,
  timeline TEXT NOT NULL,
  urgency_score INT NOT NULL DEFAULT 50,
  urgency_level TEXT NOT NULL DEFAULT 'Moderate' CHECK (urgency_level IN ('Critical', 'Moderate', 'Optimization')),
  recommended_offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Proposal Sent', 'Converted')),
  answers JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS policies for client_needs_assessments
ALTER TABLE public.client_needs_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to client_needs_assessments"
  ON public.client_needs_assessments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read to client_needs_assessments"
  ON public.client_needs_assessments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update to client_needs_assessments"
  ON public.client_needs_assessments FOR UPDATE
  TO authenticated
  USING (true);
