'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SpendingChartProps {
  data: Array<{ month: string; amount: number }>;
}

export function SpendingChart({ data }: SpendingChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Spending Trend</CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#0033AD"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
