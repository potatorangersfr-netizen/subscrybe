'use client';

import { Subscription } from '@/shared/types';
import { SubscriptionCard } from './SubscriptionCard';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onCancel: (id: string) => void;
}

export function SubscriptionList({ subscriptions, onCancel }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No subscriptions yet.</p>
        <p className="text-sm mt-2">
          Add your first subscription to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subscriptions.map((sub) => (
        <SubscriptionCard
          key={sub.id}
          subscription={sub}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}
