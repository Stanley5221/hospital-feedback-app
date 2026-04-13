'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { RatingInput } from '@/components/common/RatingInput';
import { FormInput, FormTextArea } from '@/components/common/FormInput';
import { feedbackFormSchema, FeedbackFormType } from '@/lib/validation';
import { calculateAverageRating, calculateSentiment } from '@/lib/utils';
import { supabase } from '@/supabase/client';
import Image from 'next/image';

export default function FeedbackPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showExtraFields, setShowExtraFields] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeedbackFormType>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      service_rating: 0,
      cleanliness_rating: 0,
      speed_rating: 0,
      staff_politeness_rating: 0,
    },
  });

  const serviceRating = watch('service_rating');
  const cleanlinessRating = watch('cleanliness_rating');
  const speedRating = watch('speed_rating');
  const politenesRating = watch('staff_politeness_rating');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FeedbackFormType) => {
    setIsSubmitting(true);
    try {
      let photoUrl = null;

      if (photoFile) {
        const fileName = `${Date.now()}-${photoFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('feedback-photos')
          .upload(fileName, photoFile);

        if (uploadError) throw uploadError;
        
        // FIX: Check if uploadData exists before accessing path
        if (uploadData?.path) {
          photoUrl = uploadData.path;
        }
      }

      const averageRating = calculateAverageRating(
        data.service_rating,
        data.cleanliness_rating,
        data.speed_rating,
        data.staff_politeness_rating
      );

      const sentiment = calculateSentiment(averageRating);

      const { error } = await supabase.from('feedback_responses').insert({
        service_rating: data.service_rating,
        cleanliness_rating: data.cleanliness_rating,
        speed_rating: data.speed_rating,
        staff_politeness_rating: data.staff_politeness_rating,
        average_rating: averageRating,
        comment: data.comment || null,
        contact_info: data.contact_info || null,
        photo_url: photoUrl,
        sentiment,
      });

      if (error) throw error;

      router.push('/thank-you');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[550px] mx-auto">
      <Card className="mb-5 text-center px-6 py-4 border-b border-[var(--border)] rounded-b-none">
        <div className="flex flex-col items-center">
          <div className="mb-5">
            <Image
              src="/logo.jpg"
              alt="Mary Queen of Love Medical Hospital Logo"
              width={100}
              height={100}
              className="h-auto"
            />
          </div>
          <h1 className="text-xl font-bold text-[var(--primary)] mb-1">
            Mary Queen of Love Medical Hospital, LBG
          </h1>
          <p className="text-[var(--secondary)] italic font-medium text-[13px] mb-2">
            "Love, Hope and Quality Health Service for all."
          </p>
          <p className="text-[var(--text-muted)] text-[12px]">
            Your feedback helps us improve and serve you better.
          </p>
        </div>
      </Card>

      <Card className="rounded-t-none">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2.5">
            <RatingInput
              label="How was our service?"
              value={serviceRating}
              onChange={(value) => setValue('service_rating', value)}
              required
            />

            <RatingInput
              label="How was the cleanliness?"
              value={cleanlinessRating}
              onChange={(value) => setValue('cleanliness_rating', value)}
              required
            />

            <RatingInput
              label="How fast was our service?"
              value={speedRating}
              onChange={(value) => setValue('speed_rating', value)}
              required
            />

            <RatingInput
              label="How polite was our staff?"
              value={politenesRating}
              onChange={(value) => setValue('staff_politeness_rating', value)}
              required
            />
          </div>

          <div className="pt-2">
            <label className="block text-[13px] font-medium text-[var(--text-main)] mb-2">
              Additional Comments (Optional)
            </label>
            <FormTextArea
              placeholder="How can we improve?"
              rows={2}
              {...register('comment')}
              className="text-[15px]"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowExtraFields(!showExtraFields)}
            className="w-full border border-dashed border-[var(--primary)] text-[var(--primary)] py-2 px-4 rounded-lg text-[13px] font-medium transition-all hover:bg-[rgba(0,92,156,0.05)] flex items-center justify-center gap-2"
          >
            {showExtraFields ? (
              <>
                <span>-</span> Show Less
              </>
            ) : (
              <>
                <span>+</span> Add Photo or Contact Info
              </>
            )}
          </button>

          {showExtraFields && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Attach a Photo (Optional)
                </label>
                <div className="relative h-20 border-2 border-dashed border-[var(--star-inactive)] rounded-xl flex justify-center items-center cursor-pointer bg-white/40 hover:border-[var(--primary)] hover:bg-[rgba(0,92,156,0.02)] transition-all overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    id="photo-input"
                  />
                  <div className="text-center">
                    {photoPreview ? (
                      <div className="relative w-16 h-16 mx-auto">
                        <Image
                          src={photoPreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-[var(--primary)] text-xl mb-1">📷</span>
                        <span className="text-[13px] font-medium">Tap to capture or upload</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Phone / Email (Optional)
                </label>
                <FormInput
                  placeholder="To reach back to you"
                  type="text"
                  {...register('contact_info')}
                  className="text-[15px]"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full mt-4"
            isLoading={isSubmitting}
          >
            <span>Submit Feedback</span>
            {isSubmitting ? null : <span className="text-sm">✈</span>}
          </Button>
        </form>
      </Card>
    </div>
  );
}
