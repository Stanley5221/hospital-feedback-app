// Validation and calculation utilities
import { FeedbackFormData } from '@/types';

export const calculateAverageRating = (
  service: number,
  cleanliness: number,
  speed: number,
  politeness: number
): number => {
  return Math.round(((service + cleanliness + speed + politeness) / 4) * 10) / 10;
};

export const calculateSentiment = (averageRating: number): 'positive' | 'neutral' | 'negative' => {
  if (averageRating >= 4) return 'positive';
  if (averageRating >= 3) return 'neutral';
  return 'negative';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateText = (text: string, length: number): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

export const downloadCSV = (data: any[], filename: string) => {
  const csv = convertToCSV(data);
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';

  const keys = Object.keys(data[0]);
  const csv = [keys.join(',')];

  for (const item of data) {
    const values = keys.map((key) => {
      const value = item[key];
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    });
    csv.push(values.join(','));
  }

  return csv.join('\n');
};
