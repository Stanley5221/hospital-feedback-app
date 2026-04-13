'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { LineChartWrapper, BarChartWrapper, PieChartWrapper } from '@/components/admin/Charts';
import { supabase } from '@/supabase/client';
import { FeedbackResponse } from '@/types';

export default function AnalyticsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackVolumeData, setFeedbackVolumeData] = useState<any[]>([]);
  const [categoryAveragesData, setCategoryAveragesData] = useState<any[]>([]);
  const [sentimentData, setSentimentData] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    loadAnalytics();
  }, []);

  const checkAuth = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
    }
  };

  const loadAnalytics = async () => {
    try {
      const { data: responses, error } = await supabase
        .from('feedback_responses')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const feedbackResponses = responses as FeedbackResponse[];

      // Process feedback volume (last 30 days)
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const volumeMap: { [key: string]: number } = {};
      feedbackResponses
        .filter((r) => new Date(r.created_at) >= last30Days)
        .forEach((r) => {
          const date = new Date(r.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          volumeMap[date] = (volumeMap[date] || 0) + 1;
        });

      const volumeData = Object.entries(volumeMap).map(([date, count]) => ({
        date,
        count,
      }));

      setFeedbackVolumeData(volumeData);

      // Process category averages
      if (feedbackResponses.length) {
        const avgService =
          feedbackResponses.reduce((sum, r) => sum + r.service_rating, 0) / feedbackResponses.length;
        const avgCleanliness =
          feedbackResponses.reduce((sum, r) => sum + r.cleanliness_rating, 0) / feedbackResponses.length;
        const avgSpeed =
          feedbackResponses.reduce((sum, r) => sum + r.speed_rating, 0) / feedbackResponses.length;
        const avgPolite =
          feedbackResponses.reduce((sum, r) => sum + r.staff_politeness_rating, 0) /
          feedbackResponses.length;

        setCategoryAveragesData([
          { category: 'Service', average: Math.round(avgService * 10) / 10 },
          { category: 'Cleanliness', average: Math.round(avgCleanliness * 10) / 10 },
          { category: 'Speed', average: Math.round(avgSpeed * 10) / 10 },
          { category: 'Politeness', average: Math.round(avgPolite * 10) / 10 },
        ]);

        // Process sentiment distribution
        const sentimentCounts = {
          Positive: feedbackResponses.filter((r) => r.sentiment === 'positive').length,
          Neutral: feedbackResponses.filter((r) => r.sentiment === 'neutral').length,
          Negative: feedbackResponses.filter((r) => r.sentiment === 'negative').length,
        };

        setSentimentData([
          { name: 'Positive', value: sentimentCounts.Positive },
          { name: 'Neutral', value: sentimentCounts.Neutral },
          { name: 'Negative', value: sentimentCounts.Negative },
        ]);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Detailed insights from customer feedback</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChartWrapper
            data={feedbackVolumeData}
            title="Feedback Volume (Last 30 Days)"
            xKey="date"
            yKey="count"
          />

          <PieChartWrapper
            data={sentimentData}
            title="Sentiment Distribution"
            nameKey="name"
            valueKey="value"
            colors={['#10b981', '#f59e0b', '#ef4444']}
          />
        </div>

        <BarChartWrapper
          data={categoryAveragesData}
          title="Category Averages"
          xKey="category"
          yKey="average"
        />
      </div>
    </AdminLayout>
  );
}
