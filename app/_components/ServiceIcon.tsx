'use client';

import React from 'react';
import {
  Home,
  Briefcase,
  Building2,
  ConciergeBell,
  ChefHat,
  Car,
  Baby,
  UtensilsCrossed,
  LucideProps,
} from 'lucide-react';

interface Props extends LucideProps {
  name: string;
}

export default function ServiceIcon({ name, ...props }: Props) {
  switch (name) {
    case 'Home':
      return <Home {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'Building2':
      return <Building2 {...props} />;
    case 'ConciergeBell':
      return <ConciergeBell {...props} />;
    case 'ChefHat':
      return <ChefHat {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'Baby':
      return <Baby {...props} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed {...props} />;
    default:
      return <Briefcase {...props} />;
  }
}

