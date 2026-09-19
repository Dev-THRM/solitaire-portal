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

  // Removed sample jobs as per request
  console.log('\n🎉 Seed complete!');
  console.log('   Admin login: admin@jobportal.com / Admin@123');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
