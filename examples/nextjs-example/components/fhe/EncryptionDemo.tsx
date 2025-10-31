'use client';

import React, { useState } from 'react';
import { useEncrypt } from '@fhevm-example/sdk';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export const EncryptionDemo: React.FC = () => {
  const { encrypt32, encrypt16, encrypt8, encryptBool, isEncrypting } = useEncrypt();

  const [value32, setValue32] = useState<string>('1500');
  const [value16, setValue16] = useState<string>('750');
  const [value8, setValue8] = useState<string>('42');
  const [valueBool, setValueBool] = useState<boolean>(true);

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleEncrypt = async (type: 'euint32' | 'euint16' | 'euint8' | 'ebool') => {
    try {
      setError('');
      setResult(null);

      let encrypted;
      switch (type) {
        case 'euint32':
          encrypted = await encrypt32(parseInt(value32));
          break;
        case 'euint16':
          encrypted = await encrypt16(parseInt(value16));
          break;
        case 'euint8':
          encrypted = await encrypt8(parseInt(value8));
          break;
        case 'ebool':
          encrypted = await encryptBool(valueBool);
          break;
      }

      setResult({
        type,
        original: type === 'ebool' ? valueBool :
                  type === 'euint32' ? value32 :
                  type === 'euint16' ? value16 : value8,
        encrypted: encrypted,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="euint32" subtitle="32-bit unsigned integer (0 to 4,294,967,295)">
          <Input
            type="number"
            value={value32}
            onChange={(e) => setValue32(e.target.value)}
            placeholder="Enter a number"
            className="mb-4"
          />
          <Button
            onClick={() => handleEncrypt('euint32')}
            disabled={isEncrypting}
            variant="primary"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt euint32'}
          </Button>
        </Card>

        <Card title="euint16" subtitle="16-bit unsigned integer (0 to 65,535)">
          <Input
            type="number"
            value={value16}
            onChange={(e) => setValue16(e.target.value)}
            placeholder="Enter a number"
            className="mb-4"
          />
          <Button
            onClick={() => handleEncrypt('euint16')}
            disabled={isEncrypting}
            variant="primary"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt euint16'}
          </Button>
        </Card>

        <Card title="euint8" subtitle="8-bit unsigned integer (0 to 255)">
          <Input
            type="number"
            value={value8}
            onChange={(e) => setValue8(e.target.value)}
            placeholder="Enter a number"
            className="mb-4"
          />
          <Button
            onClick={() => handleEncrypt('euint8')}
            disabled={isEncrypting}
            variant="primary"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt euint8'}
          </Button>
        </Card>

        <Card title="ebool" subtitle="Boolean value (true/false)">
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={valueBool}
                onChange={(e) => setValueBool(e.target.checked)}
                className="w-5 h-5 text-blue-600"
              />
              <span className="text-gray-700">
                {valueBool ? 'True' : 'False'}
              </span>
            </label>
          </div>
          <Button
            onClick={() => handleEncrypt('ebool')}
            disabled={isEncrypting}
            variant="primary"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt ebool'}
          </Button>
        </Card>
      </div>

      {error && (
        <Card>
          <div className="text-red-600">
            <h4 className="font-bold mb-2">Error:</h4>
            <p>{error}</p>
          </div>
        </Card>
      )}

      {result && (
        <Card title="Encryption Result" subtitle="Encrypted data ready for blockchain">
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Type:</span>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">{result.type}</code>
            </div>
            <div>
              <span className="font-semibold">Original Value:</span>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {result.original.toString()}
              </code>
            </div>
            <div>
              <span className="font-semibold">Encrypted:</span>
              <pre className="mt-2 bg-gray-100 p-3 rounded overflow-x-auto text-xs">
                {JSON.stringify(result.encrypted, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
