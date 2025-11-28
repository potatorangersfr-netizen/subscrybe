'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { HydraExplainer } from './HydraExplainer';

interface HydraToggleProps {
  value: boolean;
  onChange: (enabled: boolean) => void;
}

export function HydraToggle({ value, onChange }: HydraToggleProps) {
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Payment Method</h3>

      <div className="space-y-2">
        <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            checked={!value}
            onChange={() => onChange(false)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="font-medium">Standard (Layer 1)</div>
            <div className="text-sm text-gray-600">
              Est. time: ~20 seconds<br />
              Fee: ~0.17 ADA
            </div>
          </div>
        </label>

        <label className="flex items-start space-x-3 p-3 border-2 border-cardano-blue rounded-lg cursor-pointer hover:bg-blue-50">
          <input
            type="radio"
            checked={value}
            onChange={() => onChange(true)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="font-medium flex items-center gap-2">
              Hydra Mode ⚡
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                Demo
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Est. time: &lt;1 second<br />
              Fee: ~0.02 ADA
            </div>
          </div>
        </label>
      </div>

      <button
        onClick={() => setShowExplainer(true)}
        className="flex items-center gap-1 text-sm text-cardano-blue hover:underline"
      >
        <Info className="w-4 h-4" />
        What is Hydra Mode?
      </button>

      {showExplainer && (
        <HydraExplainer onClose={() => setShowExplainer(false)} />
      )}
    </div>
  );
}
