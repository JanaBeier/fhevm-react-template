'use client';

import { useState } from 'react';
import { EncryptionDemo } from '@/components/fhe/EncryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';
import { KeyManager } from '@/components/fhe/KeyManager';
import { BankingExample } from '@/components/examples/BankingExample';
import { MedicalExample } from '@/components/examples/MedicalExample';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type TabType = 'encryption' | 'computation' | 'keys' | 'banking' | 'medical';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('encryption');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            FHEVM Next.js Example
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete demonstration of Fully Homomorphic Encryption in Next.js applications
          </p>
        </div>

        <Card className="mb-8">
          <div className="flex flex-wrap gap-2 p-6 border-b">
            <Button
              variant={activeTab === 'encryption' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('encryption')}
            >
              Encryption Demo
            </Button>
            <Button
              variant={activeTab === 'computation' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('computation')}
            >
              Computation Demo
            </Button>
            <Button
              variant={activeTab === 'keys' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('keys')}
            >
              Key Manager
            </Button>
            <Button
              variant={activeTab === 'banking' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('banking')}
            >
              Banking Example
            </Button>
            <Button
              variant={activeTab === 'medical' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('medical')}
            >
              Medical Example
            </Button>
          </div>

          <div className="p-6">
            {activeTab === 'encryption' && <EncryptionDemo />}
            {activeTab === 'computation' && <ComputationDemo />}
            {activeTab === 'keys' && <KeyManager />}
            {activeTab === 'banking' && <BankingExample />}
            {activeTab === 'medical' && <MedicalExample />}
          </div>
        </Card>

        <footer className="text-center text-gray-600 mt-12">
          <p>
            Built with{' '}
            <a
              href="https://www.zama.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Zama FHEVM
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
