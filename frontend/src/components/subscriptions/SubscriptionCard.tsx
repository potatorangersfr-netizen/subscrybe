'use client';

import { Subscription } from '@/shared/types';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  onCancel: (id: string) => void;
}

export function SubscriptionCard({ subscription, onCancel }: SubscriptionCardProps) {
  const statusColor = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-gray-100 text-gray-800',
  }[subscription.status];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          {/* Left Side */}
          <div>
            <h3 className="font-semibold">{subscription.planName}</h3>
            <p className="text-sm text-gray-600">{subscription.merchantName}</p>
          </div>

          {/* Status Badge */}
          <span
            className={`text-xs px-2 py-1 rounded capitalize ${statusColor}`}
          >
            {subscription.status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Price Row */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="font-medium">
            {subscription.amount} {subscription.currency}
          </span>
          <span className="text-gray-500">/ {subscription.interval}</span>
        </div>

        {/* Next Payment Row */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            Next payment:{' '}
            {new Date(subscription.nextPaymentDate).toLocaleDateString()}
          </span>
        </div>
      </CardContent>

      {/* Cancel Button */}
      {subscription.status === 'active' && (
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onCancel(subscription.id)}
          >
            Cancel Subscription
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
