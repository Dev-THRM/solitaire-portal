import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'JobPortal — Find Your Next Opportunity',
    template: '%s | JobPortal',
  },
  description:
    'Browse hundreds of curated job listings and apply in minutes. Connect with top employers across India.',
  keywords: ['jobs', 'career', 'hiring', 'recruitment', 'job portal'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'JobPortal',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
