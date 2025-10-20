import type { AppProps } from 'next/app';
import { FhevmProvider } from '@fhevm-example/sdk';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FhevmProvider
      config={{
        network: 'sepolia',
        // Provider will be auto-detected from window.ethereum
      }}
    >
      <Component {...pageProps} />
    </FhevmProvider>
  );
}
