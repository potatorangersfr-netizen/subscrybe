interface HydraExplainerProps {
  onClose: () => void;
}

export function HydraExplainer({ onClose }: HydraExplainerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg mx-4 space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          ⚡ What is Hydra?
        </h2>

        <div className="space-y-3 text-gray-700">
          <p>
            Hydra is Cardano's Layer 2 scaling solution for instant,
            low-cost transactions.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Benefits at Scale:</h3>
            <ul className="space-y-1 text-sm">
              <li>• 100x faster payment processing</li>
              <li>• 95% reduction in transaction fees</li>
              <li>• Instant finality (&lt;1 second)</li>
              <li>• Perfect for recurring subscriptions</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            <strong>Note:</strong> This demo simulates how Subscrybe would
            perform with Hydra in production. Real Hydra integration planned
            for post-hackathon roadmap.
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href="https://hydra.family/head-protocol/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cardano-blue hover:underline"
          >
            Learn more about Hydra →
          </a>

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-cardano-blue text-white rounded-lg hover:bg-cardano-blue-dark"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
