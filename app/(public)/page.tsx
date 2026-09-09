import type { Metadata } from 'next';
import HomeClient from '../_components/HomeClient';

export const metadata: Metadata = {
  title: 'Solitaire Human Resources Consultancy L.L.C',
  description: 'Premium staffing solutions for private households and businesses in Dubai. Discreet. Reliable. Personal.',
};

export default function HomePage() {
  return <HomeClient />;
}
