'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface SpendingOverviewProps {
  totalMonthly: number;
  change: number;
  currency: string;
}

export function SpendingOverview({ totalMonthly, change, currency }: SpendingOverviewProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">
          Total Monthly Spending
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            {/* Main spending value */}
            <div className="text-3xl font-bold">
              {totalMonthly.toFixed(2)} {currency}
            </div>

            {/* Change vs previous month */}
            <div
              className={`flex items-center gap-1 text-sm mt-1 ${
                isPositive ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}

              <span>{Math.abs(change).toFixed(1)}% vs last month</span>
            </div>
          </div>

          {/* Big dollar icon */}
          <DollarSign className="w-12 h-12 text-gray-300" />
        </div>
      </CardContent>
    </Card>
  );
}
