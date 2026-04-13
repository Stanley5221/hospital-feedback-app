import { z } from 'zod';

export const feedbackFormSchema = z.object({
  service_rating: z.number().min(1).max(5),
  cleanliness_rating: z.number().min(1).max(5),
  speed_rating: z.number().min(1).max(5),
  staff_politeness_rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  contact_info: z.string().email().or(z.string().regex(/^\d{10,}$/)).optional().or(z.literal('')),
});

export const settingsFormSchema = z.object({
  hospital_name: z.string().min(1, 'Hospital name is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
});

export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type FeedbackFormType = z.infer<typeof feedbackFormSchema>;
export type SettingsFormType = z.infer<typeof settingsFormSchema>;
export type LoginFormType = z.infer<typeof loginFormSchema>;
