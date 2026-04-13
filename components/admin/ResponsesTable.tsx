'use client';

import { FeedbackResponse } from '@/types';
import { formatDate, truncateText } from '@/lib/utils';
import { Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import Image from 'next/image';
import { useState } from 'react';

interface ResponsesTableProps {
  responses: FeedbackResponse[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const ResponsesTable = ({ responses, onDelete, isDeleting }: ResponsesTableProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (responses.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-8">No responses yet</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contact</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ratings</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Avg</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Photo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <React.Fragment key={response.id}>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(response.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{response.contact_info || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        S: {response.service_rating}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        C: {response.cleanliness_rating}
                      </span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        Sp: {response.speed_rating}
                      </span>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                        P: {response.staff_politeness_rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{response.average_rating}</td>
                  <td className="px-6 py-4 text-sm">
                    {response.photo_url ? (
                      <Eye size={18} className="text-blue-600 cursor-pointer" />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setExpandedId(expandedId === response.id ? null : response.id)}
                      className="text-blue-600 hover:text-blue-700 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDelete(response.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700 disabled:text-gray-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                {expandedId === response.id && (
                  <tr className="bg-blue-50 border-b border-gray-200">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="space-y-3">
                        {response.comment && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Comments</p>
                            <p className="text-sm text-gray-700 mt-1">{response.comment}</p>
                          </div>
                        )}
                        {response.photo_url && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Photo</p>
                            <div className="mt-2 relative w-40 h-40">
                              <Image
                                src={response.photo_url}
                                alt="Feedback photo"
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 pt-2">
                          Sentiment: <span className="font-semibold capitalize">{response.sentiment}</span>
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

import React from 'react';
