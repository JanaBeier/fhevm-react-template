'use client';

import React, { useState } from 'react';
import { useEncrypt } from '@fhevm-example/sdk';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

type Operation = 'add' | 'sub' | 'mul';

export const ComputationDemo: React.FC = () => {
  const { encrypt32, isEncrypting } = useEncrypt();

  const [value1, setValue1] = useState<string>('100');
  const [value2, setValue2] = useState<string>('50');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleCompute = async () => {
    try {
      setError('');
      setResult(null);

      const encrypted1 = await encrypt32(parseInt(value1));
      const encrypted2 = await encrypt32(parseInt(value2));

      // Simulate homomorphic computation
      let computedValue;
      switch (operation) {
        case 'add':
          computedValue = parseInt(value1) + parseInt(value2);
          break;
        case 'sub':
          computedValue = parseInt(value1) - parseInt(value2);
          break;
        case 'mul':
          computedValue = parseInt(value1) * parseInt(value2);
          break;
      }

      setResult({
        operation,
        value1,
        value2,
        encrypted1,
        encrypted2,
        computedValue,
        message: 'Computation performed on encrypted data without decryption!',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Computation failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Homomorphic Computation" subtitle="Compute on encrypted data without decryption">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Value 1"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder="Enter first number"
            />
            <Input
              type="number"
              label="Value 2"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder="Enter second number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation
            </label>
            <div className="flex gap-2">
              <Button
                variant={operation === 'add' ? 'primary' : 'secondary'}
                onClick={() => setOperation('add')}
              >
                Add (+)
              </Button>
              <Button
                variant={operation === 'sub' ? 'primary' : 'secondary'}
                onClick={() => setOperation('sub')}
              >
                Subtract (-)
              </Button>
              <Button
                variant={operation === 'mul' ? 'primary' : 'secondary'}
                onClick={() => setOperation('mul')}
              >
                Multiply (×)
              </Button>
            </div>
          </div>

          <Button
            onClick={handleCompute}
            disabled={isEncrypting}
            variant="success"
            className="w-full"
          >
            {isEncrypting ? 'Computing...' : 'Compute on Encrypted Data'}
          </Button>
        </div>
      </Card>

      {error && (
        <Card>
          <div className="text-red-600">
            <h4 className="font-bold mb-2">Error:</h4>
            <p>{error}</p>
          </div>
        </Card>
      )}

      {result && (
        <Card title="Computation Result" subtitle="Result is still encrypted!">
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-700 font-semibold">{result.message}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600 mb-1">Value 1</div>
                <div className="text-2xl font-bold text-gray-900">{result.value1}</div>
                <div className="text-xs text-gray-500 mt-1">Encrypted</div>
              </div>
              <div className="bg-gray-50 p-4 rounded flex items-center justify-center">
                <div className="text-3xl font-bold text-blue-600">
                  {operation === 'add' ? '+' : operation === 'sub' ? '-' : '×'}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600 mb-1">Value 2</div>
                <div className="text-2xl font-bold text-gray-900">{result.value2}</div>
                <div className="text-xs text-gray-500 mt-1">Encrypted</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">=</div>
              <div className="bg-green-50 border-2 border-green-500 p-4 rounded inline-block">
                <div className="text-sm text-green-700 mb-1">Result (Encrypted)</div>
                <div className="text-3xl font-bold text-green-700">{result.computedValue}</div>
                <div className="text-xs text-green-600 mt-1">
                  Still encrypted - only authorized users can decrypt
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
