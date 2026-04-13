'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card } from '@/components/common/Card';
import { FormInput } from '@/components/common/FormInput';
import { ResponsesTable } from '@/components/admin/ResponsesTable';
import { Button } from '@/components/common/Button';
import { supabase } from '@/supabase/client';
import { FeedbackResponse } from '@/types';
import { downloadCSV } from '@/lib/utils';
import { Download } from 'lucide-react';

export default function ResponsesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [allResponses, setAllResponses] = useState<FeedbackResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<FeedbackResponse[]>([]);

  useEffect(() => {
    checkAuth();
    loadResponses();
  }, []);

  useEffect(() => {
    filterResponses();
  }, [searchQuery, ratingFilter, allResponses]);

  const checkAuth = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
    }
  };

  const loadResponses = async () => {
    try {
      const { data: responses, error } = await supabase
        .from('feedback_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAllResponses(responses as FeedbackResponse[]);
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterResponses = () => {
    let filtered = allResponses;

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.contact_info?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.comment?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (ratingFilter !== 'all') {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter((r) => r.average_rating >= minRating);
    }

    setFilteredResponses(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this response?')) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.from('feedback_responses').delete().eq('id', id);

      if (error) throw error;

      setAllResponses(allResponses.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting response:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    downloadCSV(filteredResponses, 'feedback-responses.csv');
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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Responses</h1>
            <p className="text-gray-600">Browsing {filteredResponses.length} total entries</p>
          </div>
          <Button onClick={handleExportCSV} variant="secondary" className="flex items-center gap-2">
            <Download size={16} />
            Export CSV
          </Button>
        </div>

        <Card>
          <div className="space-y-4">
            <FormInput
              label="Search Comments/Contact"
              placeholder="Type keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div>
              <label className="block text-gray-700 font-medium mb-2">Rating Level</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>
          </div>
        </Card>

        <ResponsesTable
          responses={filteredResponses}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}
