'use client';

import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'bg-white rounded-lg border border-gray-200 p-6 shadow-sm',
        hover && 'hover:shadow-md transition-shadow duration-200',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor?: string;
}

export const StatCard = ({
  label,
  value,
  icon,
  iconColor = 'bg-blue-100 text-blue-600',
}: StatCardProps) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={clsx('p-3 rounded-lg', iconColor)}>{icon}</div>
    </div>
  </Card>
);
