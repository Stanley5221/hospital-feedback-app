'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { Card } from '@/components/common/Card';

interface BarChartWrapperProps {
  data: any[];
  title?: string;
  xKey: string;
  yKey: string;
}

export const BarChartWrapper = ({ data, title, xKey, yKey }: BarChartWrapperProps) => (
  <Card>
    {title && <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>}
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yKey} fill="#3b82f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

interface LineChartWrapperProps {
  data: any[];
  title?: string;
  xKey: string;
  yKey: string;
}

export const LineChartWrapper = ({ data, title, xKey, yKey }: LineChartWrapperProps) => (
  <Card>
    {title && <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>}
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={yKey} stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

interface PieChartWrapperProps {
  data: any[];
  title?: string;
  nameKey: string;
  valueKey: string;
  colors?: string[];
}

export const PieChartWrapper = ({
  data,
  title,
  nameKey,
  valueKey,
  colors = ['#10b981', '#f59e0b', '#ef4444'],
}: PieChartWrapperProps) => (
  <Card>
    {title && <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>}
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie 
          data={data} 
          cx="50%" 
          cy="50%" 
          labelLine={false} 
          label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`} 
          outerRadius={80} 
          dataKey={valueKey}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

interface RadarChartWrapperProps {
  data: any[];
  title?: string;
  categories: string[];
}

export const RadarChartWrapper = ({ data, title, categories }: RadarChartWrapperProps) => (
  <Card>
    {title && <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>}
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="category" />
        <PolarRadiusAxis angle={90} domain={[0, 5]} />
        <Radar name="Average Rating" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  </Card>
);

interface MetricsGridProps {
  metrics: Array<{ name: string; value: number }>;
}

export const MetricsGrid = ({ metrics }: MetricsGridProps) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {metrics.map((metric) => (
      <Card key={metric.name}>
        <p className="text-gray-600 text-sm">{metric.name}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value.toFixed(1)}</p>
      </Card>
    ))}
  </div>
);
