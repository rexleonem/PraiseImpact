import prisma from '../../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const createUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
    },
  });
};

export const validateUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    return null;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, created_at: true },
  });
};
