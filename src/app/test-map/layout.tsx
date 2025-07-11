'use client';
import dynamic from 'next/dynamic';
const LeafletConfig = dynamic(() => import('./LeafletConfig'), {
  ssr: false, // Disable SSR for this component
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LeafletConfig>{children}</LeafletConfig>
  );
}