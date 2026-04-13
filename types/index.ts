export interface FeedbackResponse {
  id: string;
  service_rating: number;
  cleanliness_rating: number;
  speed_rating: number;
  staff_politeness_rating: number;
  average_rating: number;
  comment: string | null;
  contact_info: string | null;
  photo_url: string | null;
  sentiment: 'positive' | 'neutral' | 'negative';
  created_at: string;
}

export interface AppSettings {
  id: string;
  hospital_name: string;
  tagline: string;
  subtitle: string;
  logo_url: string | null;
  primary_color: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackFormData {
  service_rating: number;
  cleanliness_rating: number;
  speed_rating: number;
  staff_politeness_rating: number;
  comment?: string;
  contact_info?: string;
  photo?: File;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}
