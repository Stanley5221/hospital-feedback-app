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
    <div className="bg-white/40 px-4 py-2.5 rounded-xl border border-[rgba(226,232,240,1)] flex justify-between items-center transition-all hover:bg-white">
      <label className="text-sm font-semibold text-[#475569] mb-0">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`text-2xl transition-all hover:scale-110 ${
              value >= num ? 'text-[#fbbf24]' : 'text-[#cbd5e1]'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};
