'use client';

import React from 'react';

interface RatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
}

export const RatingInput = ({ label, value, onChange, required }: RatingInputProps) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`w-12 h-12 rounded-lg border-2 text-xl transition-all ${
              value === num
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-300 text-gray-400 hover:border-gray-400'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};
