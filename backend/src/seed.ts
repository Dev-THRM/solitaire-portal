import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from './config/db';

// Seed script — creates an initial admin account and sample jobs
// Run: npm run db:seed

async function seed() {
  console.log('🌱 Seeding database...');

  // Create default admin
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@jobportal.com' },
    update: {},
    create: {
      email: 'admin@jobportal.com',
      password: hashedPassword,
      name: 'Portal Admin',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create sample jobs
  const jobs = await Promise.all([
    prisma.job.upsert({
      where: { id: 'sample-job-1' },
      update: {},
      create: {
        id: 'sample-job-1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Solutions',
        location: 'Bengaluru, Karnataka',
        type: 'FULL_TIME',
        salary: '₹20L – ₹35L per annum',
        description:
          'We are looking for an experienced Frontend Developer to join our product team. You will be responsible for building and maintaining high-quality React applications that serve millions of users.',
        requirements:
          '• 4+ years of experience with React.js\n• Proficiency in TypeScript\n• Experience with Next.js and SSR\n• Strong understanding of CSS and responsive design\n• Familiarity with REST APIs and GraphQL',
        benefits:
          '• Flexible working hours\n• Remote-friendly\n• Health insurance\n• 30 days PTO\n• Learning & development budget',
        isActive: true,
      },
    }),
    prisma.job.upsert({
      where: { id: 'sample-job-2' },
      update: {},
      create: {
        id: 'sample-job-2',
        title: 'Backend Engineer (Node.js)',
        company: 'DataFlow Inc.',
        location: 'Remote',
        type: 'REMOTE',
        salary: '₹15L – ₹28L per annum',
        description:
          'Join our platform engineering team to build scalable backend services. You will design and implement RESTful APIs, optimize database performance, and contribute to our microservices architecture.',
        requirements:
          '• 3+ years with Node.js and TypeScript\n• Experience with MySQL/PostgreSQL\n• Knowledge of Docker and CI/CD\n• Understanding of distributed systems',
        benefits:
          '• 100% remote\n• Competitive salary\n• Stock options\n• Annual team retreat',
        isActive: true,
      },
    }),
    prisma.job.upsert({
      where: { id: 'sample-job-3' },
      update: {},
      create: {
        id: 'sample-job-3',
        title: 'UI/UX Designer',
        company: 'Creative Studio',
        location: 'Mumbai, Maharashtra',
        type: 'FULL_TIME',
        salary: '₹10L – ₹18L per annum',
        description:
          'We are seeking a talented UI/UX Designer to craft intuitive and beautiful user experiences for our SaaS products. You will work closely with product managers and engineers.',
        requirements:
          '• 2+ years of UI/UX design experience\n• Proficiency in Figma\n• Portfolio demonstrating end-to-end design work\n• Understanding of design systems',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${jobs.length} sample jobs created`);
  console.log('\n🎉 Seed complete!');
  console.log('   Admin login: admin@jobportal.com / Admin@123');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
