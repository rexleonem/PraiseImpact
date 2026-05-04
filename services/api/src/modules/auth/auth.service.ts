import prisma from '../../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const createUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
    },
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, created_at: true },
  });
};
