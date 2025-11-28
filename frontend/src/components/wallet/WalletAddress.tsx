'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@meshsdk/react';
import { Copy, Check } from 'lucide-react';

export function WalletAddress() {
  const { wallet, connected } = useWallet();
  const [address, setAddress] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Load used address when wallet is connected
  useEffect(() => {
    async function fetchAddress() {
      if (!wallet || !connected) {
        setAddress('');
        return;
      }

      try {
        const addrs = await wallet.getUsedAddresses();
        if (addrs.length > 0) {
          setAddress(addrs[0]);
        }
      } catch (error) {
        console.error('Failed to fetch wallet address:', error);
      }
    }

    fetchAddress();
  }, [wallet, connected]);

  // Truncate long Cardano address
  const truncate = (addr: string) =>
    addr ? `${addr.slice(0, 12)}...${addr.slice(-8)}` : '';

  // Copy address to clipboard
  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!connected) {
    return (
      <div className="text-xs text-gray-500">
        Wallet not connected
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
        {truncate(address)}
      </code>

      <button
        onClick={copyAddress}
        className="p-1 hover:bg-gray-200 rounded transition-colors"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </div>
  );
}
