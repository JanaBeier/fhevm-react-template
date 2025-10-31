'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const KeyManager: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchPublicKey();
  }, []);

  const fetchPublicKey = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/keys');
      const data = await response.json();

      if (data.success) {
        setPublicKey(data.publicKey.key);
      } else {
        setError(data.error || 'Failed to fetch public key');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch key');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshKey = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' }),
      });

      const data = await response.json();

      if (data.success) {
        setPublicKey(data.publicKey);
      } else {
        setError(data.error || 'Failed to refresh key');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Public Key Management" subtitle="Manage encryption keys for FHEVM">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Public Key
            </label>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm break-all">
              {loading ? (
                <div className="text-gray-500">Loading...</div>
              ) : publicKey ? (
                publicKey
              ) : (
                <div className="text-gray-400">No key available</div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={fetchPublicKey}
              disabled={loading}
              variant="primary"
            >
              {loading ? 'Loading...' : 'Fetch Key'}
            </Button>
            <Button
              onClick={handleRefreshKey}
              disabled={loading}
              variant="secondary"
            >
              Refresh Key
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Key Information" subtitle="Details about FHEVM encryption">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Algorithm:</span>
            <span className="text-gray-600">TFHE (Fully Homomorphic Encryption)</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Key Type:</span>
            <span className="text-gray-600">Public Key</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-700">Purpose:</span>
            <span className="text-gray-600">Client-side encryption</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Network:</span>
            <span className="text-gray-600">Sepolia Testnet</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-bold text-blue-700 mb-2">How It Works</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
            <li>Public key is used to encrypt data on the client side</li>
            <li>Encrypted data is sent to the blockchain</li>
            <li>Computations are performed on encrypted data</li>
            <li>Only authorized users can decrypt the results</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
