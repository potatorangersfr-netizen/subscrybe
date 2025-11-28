'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@meshsdk/react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

export function WalletConnectButton() {
  const { connect, disconnect, connected, wallet, name } = useWallet();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Fetch wallet address when connected
  useEffect(() => {
    async function loadAddress() {
      if (connected && wallet) {
        const used = await wallet.getUsedAddresses();
        if (used.length > 0) {
          setAddress(used[0]);
        }
      }
    }
    loadAddress();
  }, [connected, wallet]);

  // Handle wallet connection
  const handleConnect = async () => {
    setLoading(true);
    try {
      await connect('nami');
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // UI when connected
  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-sm">
          {address.slice(0, 8)}...{address.slice(-6)}
          <button
            onClick={copyAddress}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        <Button variant="outline" size="sm" onClick={disconnect}>
          Disconnect {name}
        </Button>
      </div>
    );
  }

  // UI when disconnected
  return (
    <Button onClick={handleConnect} disabled={loading}>
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}
