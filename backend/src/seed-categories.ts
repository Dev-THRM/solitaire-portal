/**
 * Seed script for the categories taxonomy.
 * Run with: npm run db:seed-categories
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    name: 'House Manager',
    description:
      'Oversees the day-to-day operations of a private residence or estate. Responsibilities include staff management, vendor coordination, maintenance scheduling, budgeting, and ensuring the household runs smoothly.',
  },
  {
    name: 'Executive Assistant',
    description:
      'Provides high-level administrative support to a principal or executive. Tasks include calendar management, travel arrangements, correspondence, meeting coordination, and confidential document handling.',
  },
  {
    name: 'Facility Manager',
    description:
      'Manages the physical infrastructure of a property or portfolio of properties. Covers maintenance, safety compliance, contractor oversight, utilities management, and operational planning.',
  },
  {
    name: 'Butler',
    description:
      'Personal service professional in a private household. Specialises in silver service, formal dining, household staff supervision, wardrobe management, and discreet guest/family assistance.',
  },
  {
    name: 'Personal Chef',
    description:
      'Prepares bespoke meals for a private individual or family. Expertise in specific dietary requirements, menu planning, kitchen management, and sourcing premium ingredients.',
  },
  {
    name: 'Chauffeur',
    description:
      'Professional driver for a private principal or family. Responsible for safe and timely transportation, vehicle maintenance and presentation, route planning, and confidentiality.',
  },
  {
    name: 'Nanny',
    description:
      'Provides primary childcare within a private household. Duties include daily routines, educational activities, school liaison, travel with the family, and holistic child development support.',
  },
  {
    name: 'Multicuisine Chef',
    description:
      'Skilled in cooking across multiple international culinary traditions. Able to plan and execute diverse menus covering cuisines from different cultures, suitable for cosmopolitan households or entertaining.',
  },
];

async function main() {
  console.log('[SEED] Seeding categories...');

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description, isActive: true },
      create: cat,
    });
    console.log(`  ✓ ${cat.name}`);
  }

  console.log(`[OK] ${CATEGORIES.length} categories seeded.`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
