import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import CssBaseline from '@mui/material/CssBaseline';
import { Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Header from '../../../components/header';
import { getBusinessUnits } from '../../../lib/actions/business-units';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tropicana Worldwide Corporation - Luxury Hotels & Resorts',
  description: 'Experience luxury at its finest with Tropicana Worldwide Corporation. Discover our premium hotels and resorts: Anchor Hotel, Dolores Farm Resort, Dolores Lake Resort, and Dolores Tropicana Resort.',
  keywords: 'luxury hotels, resorts, Tropicana, Dolores, Anchor Hotel, vacation, accommodation',
  authors: [{ name: 'Tropicana Worldwide Corporation' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Loading component for header
const HeaderLoading = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'white',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
    }}
  >
    <CircularProgress size={20} />
  </Box>
);

// Header component with data fetching
const HeaderWithData = async () => {
  try {
    const businessUnits = await getBusinessUnits();
    return <Header businessUnits={businessUnits} />;
  } catch (error) {
    console.error('Failed to load header data:', error);
    // Fallback header with empty data
    return <Header businessUnits={[]} />;
  }
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline />
        <Suspense fallback={<HeaderLoading />}>
          <HeaderWithData />
        </Suspense>
        <main style={{ paddingTop: '70px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}