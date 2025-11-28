'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface AddSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    planId: string;
    merchantName: string;
    planName: string;
    amount: number;
    interval: 'monthly' | 'yearly';
  }) => void;
}

export function AddSubscriptionModal({
  open,
  onClose,
  onSubmit,
}: AddSubscriptionModalProps) {
  const [planId, setPlanId] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [planName, setPlanName] = useState('');
  const [amount, setAmount] = useState('');
  const [interval, setInterval] =
    useState<'monthly' | 'yearly'>('monthly');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      planId,
      merchantName,
      planName,
      amount: parseFloat(amount),
      interval,
    });

    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan ID */}
          <div className="space-y-2">
            <Label htmlFor="planId">Plan ID</Label>
            <Input
              id="planId"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              required
            />
          </div>

          {/* Merchant Name */}
          <div className="space-y-2">
            <Label htmlFor="merchantName">Merchant Name</Label>
            <Input
              id="merchantName"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              required
            />
          </div>

          {/* Plan Name */}
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ADA)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Billing Interval */}
          <div className="space-y-2">
            <Label htmlFor="interval">Billing Interval</Label>
            <Select
              value={interval}
              onValueChange={(v) =>
                setInterval(v as 'monthly' | 'yearly')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit">Add Subscription</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
