import { useState } from 'react';
import { useFhevm, useEncrypt } from '@fhevm-example/sdk';
import EncryptDemo from '../components/EncryptDemo';
import ContractInteraction from '../components/ContractInteraction';

export default function Home() {
  const { isInitialized, error } = useFhevm();
  const [activeTab, setActiveTab] = useState<'encrypt' | 'contract'>('encrypt');

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>❌ Initialization Error</h2>
          <p>{error.message}</p>
          <p>Make sure MetaMask is installed and connected to Sepolia testnet.</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Initializing FHEVM SDK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>🔐 FHEVM SDK Demo</h1>
        <p>Next.js Example - Privacy-Preserving Encryption</p>
      </header>

      <div className="tabs">
        <button
          className={activeTab === 'encrypt' ? 'active' : ''}
          onClick={() => setActiveTab('encrypt')}
        >
          Encryption Demo
        </button>
        <button
          className={activeTab === 'contract' ? 'active' : ''}
          onClick={() => setActiveTab('contract')}
        >
          Contract Interaction
        </button>
      </div>

      <div className="content">
        {activeTab === 'encrypt' && <EncryptDemo />}
        {activeTab === 'contract' && <ContractInteraction />}
      </div>

      <footer>
        <p>
          Built with <a href="https://www.zama.ai/" target="_blank" rel="noopener noreferrer">Zama FHEVM</a>
        </p>
      </footer>
    </div>
  );
}
