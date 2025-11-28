'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Subscription } from '@/shared/types';
import { Calendar } from 'lucide-react';

interface UpcomingPaymentsProps {
  subscriptions: Subscription[];
}

export function UpcomingPayments({ subscriptions }: UpcomingPaymentsProps) {
  const upcoming = subscriptions
    .filter((s) => s.status === 'active')
    .sort(
      (a, b) =>
        new Date(a.nextPaymentDate).getTime() -
        new Date(b.nextPaymentDate).getTime()
    )
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Upcoming Payments
        </CardTitle>
      </CardHeader>

      <CardContent>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming payments</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />

                  <div>
                    <div className="text-sm font-medium">
                      {sub.planName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sub.merchantName}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium">
                    {sub.amount} {sub.currency}
                  </div>

                  <div className="text-xs text-gray-500">
                    {new Date(sub.nextPaymentDate).toLocaleDateString(
                      'en-US',
                      { month: 'short', day: 'numeric' }
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
