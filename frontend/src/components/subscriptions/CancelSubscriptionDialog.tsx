'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CancelSubscriptionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subscriptionName: string;
}

export function CancelSubscriptionDialog({
  open,
  onClose,
  onConfirm,
  subscriptionName,
}: CancelSubscriptionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel "{subscriptionName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* DO NOT attach onClick manually — AlertDialogCancel closes automatically */}
          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Cancel Subscription
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
