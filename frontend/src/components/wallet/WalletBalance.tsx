'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@meshsdk/react';

export function WalletBalance() {
  const { wallet, connected } = useWallet();
  const [balance, setBalance] = useState<string>('0.00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBalance() {
      if (!wallet || !connected) {
        setLoading(false);
        return;
      }

      try {
        const lovelace = await wallet.getLovelace(); // returns string
        const ada = (parseInt(lovelace) / 1_000_000).toFixed(2);
        setBalance(ada);
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, [wallet, connected]);

  // Not connected
  if (!connected) {
    return <div className="text-sm text-gray-500">No Wallet Connected</div>;
  }

  // Loading state
  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  // Display ADA amount
  return (
    <div className="text-sm font-medium">
      {balance} ADA
    </div>
  );
}
