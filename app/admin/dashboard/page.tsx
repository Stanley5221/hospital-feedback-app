'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/common/Card';
import { Card } from '@/components/common/Card';
import { RadarChartWrapper } from '@/components/admin/Charts';
import { ResponsesTable } from '@/components/admin/ResponsesTable';
import { createClient } from '@/utils/supabase/client';
import { FeedbackResponse } from '@/types';
import { Users, Star, Zap, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    totalResponses: 0,
    overallRating: 0,
    speedAverage: 0,
    cleanlinessAverage: 0,
  });
  const [recentResponses, setRecentResponses] = useState<FeedbackResponse[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: responses, error } = await supabase
        .from('feedback_responses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const feedbackResponses = responses as FeedbackResponse[];

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
        const overallAvg = (avgService + avgCleanliness + avgSpeed + avgPolite) / 4;

        setStats({
          totalResponses: feedbackResponses.length,
          overallRating: Math.round(overallAvg * 10) / 10,
          speedAverage: Math.round(avgSpeed * 10) / 10,
          cleanlinessAverage: Math.round(avgCleanliness * 10) / 10,
        });

        setRadarData([
          { category: 'Service', value: avgService },
          { category: 'Cleanliness', value: avgCleanliness },
          { category: 'Speed', value: avgSpeed },
          { category: 'Politeness', value: avgPolite },
        ]);
      }

      setRecentResponses(feedbackResponses.slice(0, 5));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this response?')) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.from('feedback_responses').delete().eq('id', id);

      if (error) throw error;

      setRecentResponses(recentResponses.filter((r) => r.id !== id));
      await loadData();
    } catch (error) {
      console.error('Error deleting response:', error);
    } finally {
      setIsDeleting(false);
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Admin!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Responses"
            value={stats.totalResponses}
            icon={<Users size={24} />}
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Overall Rating"
            value={stats.overallRating}
            icon={<Star size={24} />}
            iconColor="bg-yellow-100 text-yellow-600"
          />
          <StatCard
            label="Speed Average"
            value={stats.speedAverage}
            icon={<Zap size={24} />}
            iconColor="bg-green-100 text-green-600"
          />
          <StatCard
            label="Cleanliness"
            value={stats.cleanlinessAverage}
            icon={<Sparkles size={24} />}
            iconColor="bg-purple-100 text-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RadarChartWrapper
            data={radarData}
            title="Performance Metrics"
            categories={['Service', 'Cleanliness', 'Speed', 'Politeness']}
          />

          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Positive Feedback</span>
                <span className="font-semibold text-green-600">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Neutral Feedback</span>
                <span className="font-semibold text-gray-600">30%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Needs Improvement</span>
                <span className="font-semibold text-red-600">25%</span>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Responses</h2>
          <ResponsesTable
            responses={recentResponses}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
