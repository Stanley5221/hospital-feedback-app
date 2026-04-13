'use client';

import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export default function ThankYouPage() {
  return (
    <div className="max-w-xl mx-auto flex items-center justify-center min-h-[50vh] px-4">
      <Card className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>

        <p className="text-gray-600 mb-6">
          Your feedback has been successfully submitted. We appreciate your time and input.
        </p>

        <Link href="/">
          <Button size="lg" className="w-full">
            Submit Another Feedback
          </Button>
        </Link>
      </Card>
    </div>
  );
}
