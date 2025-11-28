'use client';

import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface HydraPaymentButtonProps {
  hydraEnabled: boolean;
  processing: boolean;
  onPayment: () => void;
}

export function HydraPaymentButton({
  hydraEnabled,
  processing,
  onPayment,
}: HydraPaymentButtonProps) {
  return (
    <Button
      onClick={onPayment}
      disabled={processing}
      className={hydraEnabled ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
    >
      {processing ? (
        <span className="flex items-center gap-2">
          <div className="animate-spin">⚡</div>
          {hydraEnabled ? 'Processing via Hydra...' : 'Processing...'}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {hydraEnabled && <Zap className="w-4 h-4" />}
          Authorize Payment
        </span>
      )}
    </Button>
  );
}
