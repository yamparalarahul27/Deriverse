'use client';

import { useState } from 'react';

interface AddressInputProps {
  onSubmit: (address: string) => void;
  loading?: boolean;
}

export default function AddressInput({ onSubmit, loading = false }: AddressInputProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const validateAddress = (addr: string): boolean => {
    // Solana addresses are base58-encoded 32-byte keys — 32 to 44 characters.
    if (addr.length < 32 || addr.length > 44) {
      return false;
    }

    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    return base58Regex.test(addr);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);

    // Clear error when user starts typing
    if (value.length === 0) {
      setError('');
    } else if (!validateAddress(value)) {
      setError('Please paste a valid Solana address (32–44 characters, base58 format)');
    } else {
      setError('');
    }
  };

  const handleSubmit = () => {
    if (validateAddress(address)) {
      onSubmit(address);
    } else {
      setError('Please paste a valid Solana address (32–44 characters, base58 format)');
    }
  };

  const isValid = validateAddress(address);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="relative flex-1">
            <input
              type="text"
              value={address}
              onChange={handleInputChange}
              placeholder="Paste Solana wallet address (base58 format)"
              aria-label="Solana wallet address"
              aria-invalid={!!error}
              aria-describedby={error ? 'address-input-error' : undefined}
              className={`w-full px-4 py-3 bg-black/60 border rounded-none text-white placeholder-zinc-500 focus:outline-none focus:ring-2 ${error
                ? 'border-red-500/50 focus:ring-red-500'
                : 'border-white/10 focus:ring-blue-500'
                }`}
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="sm:w-auto w-full px-6 py-3 bg-blue-600 text-white rounded-none font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Run'}
          </button>
        </div>

        {error && (
          <p id="address-input-error" role="alert" className="text-red-400 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
