'use client';

import React, { useState } from 'react';
import { useEncrypt } from '@fhevm-example/sdk';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  encrypted: boolean;
  timestamp: number;
}

export const BankingExample: React.FC = () => {
  const { encrypt32, isEncrypting } = useEncrypt();

  const [balance, setBalance] = useState<number>(1000);
  const [amount, setAmount] = useState<string>('100');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string>('');

  const handleDeposit = async () => {
    try {
      setError('');
      const depositAmount = parseInt(amount);

      if (isNaN(depositAmount) || depositAmount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      const encrypted = await encrypt32(depositAmount);

      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: depositAmount,
        encrypted: true,
        timestamp: Date.now(),
      };

      setBalance(prev => prev + depositAmount);
      setTransactions(prev => [transaction, ...prev]);
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit failed');
    }
  };

  const handleWithdraw = async () => {
    try {
      setError('');
      const withdrawAmount = parseInt(amount);

      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      if (withdrawAmount > balance) {
        setError('Insufficient balance');
        return;
      }

      const encrypted = await encrypt32(withdrawAmount);

      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdraw',
        amount: withdrawAmount,
        encrypted: true,
        timestamp: Date.now(),
      };

      setBalance(prev => prev - withdrawAmount);
      setTransactions(prev => [transaction, ...prev]);
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Private Banking Example" subtitle="Encrypted account balances and transactions">
        <div className="mb-6 text-center">
          <div className="text-sm text-gray-600 mb-2">Encrypted Balance</div>
          <div className="text-4xl font-bold text-blue-600">
            ${balance.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Only you can see this balance
          </div>
        </div>

        <div className="space-y-4">
          <Input
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleDeposit}
              disabled={isEncrypting}
              variant="success"
            >
              {isEncrypting ? 'Processing...' : 'Deposit'}
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={isEncrypting}
              variant="danger"
            >
              {isEncrypting ? 'Processing...' : 'Withdraw'}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Transaction History" subtitle="All amounts are encrypted on-chain">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No transactions yet
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className={`p-4 rounded-lg border ${
                  tx.type === 'deposit' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold capitalize">
                      {tx.type}
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                    </div>
                    <div className="text-xs text-gray-500">
                      Encrypted: {tx.encrypted ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-bold text-blue-700 mb-2">Privacy Features</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
            <li>All balances are encrypted on the blockchain</li>
            <li>Transaction amounts are never revealed</li>
            <li>Only account owner can decrypt their balance</li>
            <li>Bank can verify transactions without seeing amounts</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
