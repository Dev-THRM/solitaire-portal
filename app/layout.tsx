import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Solitaire HR Consultancy Dubai — Luxury Household & Corporate Staffing',
    template: '%s | Solitaire HR Consultancy Dubai',
  },
  description:
    'Browse hundreds of curated luxury job listings and apply in minutes. Connect with top employers and private households across Dubai and the UAE.',
  keywords: ['jobs dubai', 'luxury staffing', 'career', 'hiring', 'recruitment', 'dubai jobs', 'uae careers'],
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    siteName: 'Solitaire HR Consultancy Dubai',
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
