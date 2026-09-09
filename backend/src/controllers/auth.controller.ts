import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

// POST /api/auth/login
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    res.status(401).json({ success: false, error: 'Invalid email or password' });
    return;
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    res.status(401).json({ success: false, error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign(
    { adminId: admin.id, email: admin.email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as any,
  );

  res.json({
    success: true,
    data: {
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    },
  });
}

// POST /api/auth/me — Verify token & return admin info
export async function me(req: Request, res: Response): Promise<void> {
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin!.adminId },
    select: { id: true, name: true, email: true },
  });

  if (!admin) {
    res.status(404).json({ success: false, error: 'Admin not found' });
    return;
  }

  res.json({ success: true, data: admin });
}
