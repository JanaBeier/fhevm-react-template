import { useState } from 'react';
import { useEncrypt } from '@fhevm-example/sdk';

export default function EncryptDemo() {
  const { encrypt32, encrypt16, encrypt8, encryptBool, isEncrypting } = useEncrypt();

  const [value32, setValue32] = useState('1500');
  const [value16, setValue16] = useState('750');
  const [value8, setValue8] = useState('100');
  const [boolValue, setBoolValue] = useState(true);

  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleEncrypt = async (type: 'euint32' | 'euint16' | 'euint8' | 'ebool') => {
    setError('');
    setResult('');

    try {
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
          encrypted = await encryptBool(boolValue);
          break;
      }

      setResult(
        `✅ Encrypted successfully!\n\n` +
        `Type: ${type}\n` +
        `Ciphertext: ${encrypted.ciphertext.slice(0, 20)}...${encrypted.ciphertext.slice(-20)}\n` +
        `Signature: ${encrypted.signature.slice(0, 20)}...${encrypted.signature.slice(-20)}`
      );
    } catch (err: any) {
      setError(`❌ Encryption failed: ${err.message}`);
    }
  };

  return (
    <div className="demo-section">
      <h2>🔒 Encrypt Values</h2>
      <p>Demonstrate FHE encryption with different data types</p>

      <div className="encrypt-options">
        {/* euint32 */}
        <div className="encrypt-card">
          <h3>euint32 (32-bit)</h3>
          <p>0 to 4,294,967,295</p>
          <input
            type="number"
            value={value32}
            onChange={(e) => setValue32(e.target.value)}
            placeholder="Enter value"
            min="0"
            max="4294967295"
          />
          <button
            onClick={() => handleEncrypt('euint32')}
            disabled={isEncrypting}
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt euint32'}
          </button>
        </div>

        {/* euint16 */}
        <div className="encrypt-card">
          <h3>euint16 (16-bit)</h3>
          <p>0 to 65,535</p>
          <input
            type="number"
            value={value16}
            onChange={(e) => setValue16(e.target.value)}
            placeholder="Enter value"
            min="0"
            max="65535"
          />
          <button
            onClick={() => handleEncrypt('euint16')}
            disabled={isEncrypting}
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt euint16'}
          </button>
        </div>

        {/* euint8 */}
        <div className="encrypt-card">
          <h3>euint8 (8-bit)</h3>
          <p>0 to 255</p>
          <input
            type="number"
            value={value8}
            onChange={(e) => setValue8(e.target.value)}
            placeholder="Enter value"
            min="0"
            max="255"
          />
          <button
            onClick={() => handleEncrypt('euint8')}
            disabled={isEncrypting}
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt euint8'}
          </button>
        </div>

        {/* ebool */}
        <div className="encrypt-card">
          <h3>ebool (Boolean)</h3>
          <p>true or false</p>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={boolValue}
              onChange={(e) => setBoolValue(e.target.checked)}
            />
            {boolValue ? 'True' : 'False'}
          </label>
          <button
            onClick={() => handleEncrypt('ebool')}
            disabled={isEncrypting}
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt ebool'}
          </button>
        </div>
      </div>

      {result && (
        <div className="result success">
          <pre>{result}</pre>
        </div>
      )}

      {error && (
        <div className="result error">
          <pre>{error}</pre>
        </div>
      )}

      <div className="info-box">
        <h4>ℹ️ How It Works</h4>
        <ul>
          <li>Values are encrypted client-side before being sent to the blockchain</li>
          <li>The ciphertext can be stored on-chain without revealing the original value</li>
          <li>Computations can be performed on encrypted data using FHE operations</li>
          <li>Only authorized parties with the correct permissions can decrypt</li>
        </ul>
      </div>
    </div>
  );
}
