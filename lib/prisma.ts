import { PrismaClient } from '@prisma/client';

/**
 * Build the MySQL connection URL from individual environment variables.
 * Using encodeURIComponent on the password means special characters like
 * @, #, % are handled safely without manual encoding in the hosting panel.
 * Falls back to DATABASE_URL if the DB_* vars are not set.
 */
function buildDatabaseUrl(): string {
  const host     = process.env.DB_HOST;
  const port     = process.env.DB_PORT || '3306';
  const user     = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const name     = process.env.DB_NAME;

  // DEBUG — remove after confirming connection works
  console.log('[prisma] DB vars:', {
    DB_HOST:     host     ?? '(not set)',
    DB_PORT:     port,
    DB_USER:     user     ?? '(not set)',
    DB_PASSWORD: password ? `(set, length=${password.length})` : '(not set)',
    DB_NAME:     name     ?? '(not set)',
    DATABASE_URL: process.env.DATABASE_URL ? '(set)' : '(not set)',
  });

  if (host && user && password !== undefined && name) {
    const url = `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
    console.log('[prisma] Using constructed URL:', url.replace(/:([^@]+)@/, ':***@'));
    return url;
  }

  // Fallback: legacy single DATABASE_URL var
  console.log('[prisma] Falling back to DATABASE_URL');
  return process.env.DATABASE_URL ?? '';
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: buildDatabaseUrl() } },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
