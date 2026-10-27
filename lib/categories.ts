import prisma from './prisma';

export async function listCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { candidateCategories: true } },
    },
  });
  return categories.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function createCategory(data: { name: string; description: string }) {
  const category = await prisma.category.create({
    data: { name: data.name.trim(), description: data.description.trim() },
  });
  return {
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export async function updateCategory(
  id: string,
  data: { name?: string; description?: string; isActive?: boolean },
) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const category = await prisma.category.update({
    where: { id },
    data: updateData,
  });
  return {
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export async function deactivateCategory(id: string) {
  return prisma.category.update({
    where: { id },
    data: { isActive: false },
  });
}
