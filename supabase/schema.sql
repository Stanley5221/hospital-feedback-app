-- Supabase SQL Schema for Hospital Feedback System
-- Copy and paste this into the Supabase SQL Editor to set up your database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create feedback_responses table
CREATE TABLE IF NOT EXISTS feedback_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_rating INTEGER NOT NULL CHECK (service_rating >= 1 AND service_rating <= 5),
  cleanliness_rating INTEGER NOT NULL CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  speed_rating INTEGER NOT NULL CHECK (speed_rating >= 1 AND speed_rating <= 5),
  staff_politeness_rating INTEGER NOT NULL CHECK (staff_politeness_rating >= 1 AND staff_politeness_rating <= 5),
  average_rating DECIMAL(3,1) NOT NULL,
  comment TEXT,
  contact_info TEXT,
  photo_url TEXT,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_name TEXT NOT NULL DEFAULT 'Mary Queen of Love Medical Hospital, LBG',
  tagline TEXT NOT NULL DEFAULT 'Love, Hope and Quality Health Service for all.',
  subtitle TEXT NOT NULL DEFAULT 'Your feedback helps us improve and serve you better.',
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_responses_created_at ON feedback_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_responses_sentiment ON feedback_responses(sentiment);
CREATE INDEX IF NOT EXISTS idx_feedback_responses_average_rating ON feedback_responses(average_rating);

-- Enable Row Level Security (RLS)
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anyone to insert feedback responses
CREATE POLICY "Anyone can insert feedback" ON feedback_responses
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Allow authenticated users (admins) to read all feedback
CREATE POLICY "Authenticated users can read feedback" ON feedback_responses
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policy: Allow authenticated users (admins) to delete feedback
CREATE POLICY "Authenticated users can delete feedback" ON feedback_responses
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS Policy: Allow anyone to read settings (they are public)
CREATE POLICY "Anyone can read app settings" ON app_settings
  FOR SELECT
  USING (true);

-- RLS Policy: Allow authenticated users (admins) to update settings
CREATE POLICY "Authenticated users can update settings" ON app_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Allow authenticated users (admins) to insert settings
CREATE POLICY "Authenticated users can insert settings" ON app_settings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create storage bucket for feedback photos
-- Note: You'll need to create this via the Supabase UI or use the storage API
-- The bucket should be named "feedback-photos" and be set to public

-- Grant permissions
GRANT SELECT, INSERT ON feedback_responses TO authenticated, anon;
GRANT DELETE ON feedback_responses TO authenticated;
GRANT SELECT ON app_settings TO authenticated, anon;
GRANT UPDATE, INSERT ON app_settings TO authenticated;
