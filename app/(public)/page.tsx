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
        photoUrl = uploadData.path;
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
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6">
        <div className="text-center mb-4">
          <div className="inline-block bg-white rounded-full p-4 mb-4">
            <svg
              className="w-16 h-16 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mary Queen of Love Medical Hospital, LBG
          </h1>
          <p className="text-blue-600 italic mb-3">"Love, Hope and Quality Health Service for all."</p>
          <p className="text-gray-600">Your feedback helps us improve and serve you better.</p>
        </div>
      </Card>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <FormTextArea
            label="Additional Comments (Optional)"
            placeholder="How can we improve?"
            {...register('comment')}
          />

          <div>
            <button
              type="button"
              onClick={() => setShowExtraFields(!showExtraFields)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showExtraFields ? '▼' : '▶'} {showExtraFields ? 'Hide' : 'Show'} Additional Options
            </button>
          </div>

          {showExtraFields && (
            <div className="border-t pt-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Attach a Photo <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-input"
                  />
                  <label htmlFor="photo-input" className="cursor-pointer">
                    {photoPreview ? (
                      <div className="relative w-32 h-32 mx-auto">
                        <Image
                          src={photoPreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div>
                        <svg
                          className="w-12 h-12 mx-auto text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <p className="text-gray-600">Tap to capture or upload</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <FormInput
                label="Phone / Email (Optional)"
                placeholder="To reach back to you"
                type="text"
                {...register('contact_info')}
              />
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
