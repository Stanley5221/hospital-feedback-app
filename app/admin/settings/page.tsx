'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { FormInput } from '@/components/common/FormInput';
import { settingsFormSchema, SettingsFormType } from '@/lib/validation';
import { supabase } from '@/supabase/client';
import { AppSettings } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [userEmail, setUserEmail] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormType>({
    resolver: zodResolver(settingsFormSchema),
  });

  useEffect(() => {
    checkAuth();
    loadSettings();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.push('/admin/login');
    } else {
      setUserEmail(data.session.user.email || '');
    }
  };

  const loadSettings = async () => {
    try {
      const { data: settings, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (settings) {
        setSettings(settings);
        reset({
          hospital_name: settings.hospital_name,
          tagline: settings.tagline,
          subtitle: settings.subtitle,
          primary_color: settings.primary_color || '#3b82f6',
        });
      } else {
        reset({
          hospital_name: 'Mary Queen of Love Medical Hospital, LBG',
          tagline: '"Love, Hope and Quality Health Service for all."',
          subtitle: 'Your feedback helps us improve and serve you better.',
          primary_color: '#3b82f6',
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SettingsFormType) => {
    setIsSaving(true);
    try {
      if (settings) {
        const { error } = await supabase
          .from('app_settings')
          .update({
            hospital_name: data.hospital_name,
            tagline: data.tagline,
            subtitle: data.subtitle,
            primary_color: data.primary_color,
            updated_at: new Date().toISOString(),
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('app_settings').insert({
          hospital_name: data.hospital_name,
          tagline: data.tagline,
          subtitle: data.subtitle,
          primary_color: data.primary_color,
        });

        if (error) throw error;
      }

      alert('Settings saved successfully!');
      await loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="text-center text-gray-500">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your hospital configuration</p>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Hospital Information</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label="Hospital Name"
              placeholder="Mary Queen of Love Medical Hospital, LBG"
              {...register('hospital_name')}
              error={errors.hospital_name?.message}
            />

            <FormInput
              label="Tagline"
              placeholder="Love, Hope and Quality Health Service for all."
              {...register('tagline')}
              error={errors.tagline?.message}
            />

            <FormInput
              label="Subtitle"
              placeholder="Your feedback helps us improve and serve you better."
              {...register('subtitle')}
              error={errors.subtitle?.message}
            />

            <div>
              <label className="block text-gray-700 font-medium mb-2">Primary Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  {...register('primary_color')}
                  className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  {...register('primary_color')}
                  placeholder="#3b82f6"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.primary_color && (
                <p className="text-red-500 text-sm mt-1">{errors.primary_color.message}</p>
              )}
            </div>

            <Button type="submit" size="lg" isLoading={isSaving}>
              Save Changes
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Profile</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Email Address</p>
              <p className="text-lg font-semibold text-gray-900">{userEmail}</p>
            </div>
            <p className="text-sm text-gray-500">
              To change your password, please use the authentication provider's password reset feature.
            </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
