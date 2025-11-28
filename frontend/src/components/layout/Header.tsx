import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-cardano-blue">Subscrybe</h1>
        </div>
        <WalletConnectButton />
      </div>
    </header>
  );
}
