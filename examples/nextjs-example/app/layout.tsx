import type { Metadata } from 'next';
import './globals.css';
import { FhevmProvider } from '@fhevm-example/sdk';

export const metadata: Metadata = {
  title: 'FHEVM Next.js Example',
  description: 'Complete Next.js application demonstrating FHEVM SDK integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FhevmProvider config={{ network: 'sepolia' }}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
