import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { generateToken } from '../utils/token';

export const registerUser = async (data: any) => {
  const { name, email, password } = data;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password_hash: hashedPassword,
    },
  });

  const token = generateToken(user.id, user.role);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id, user.role);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};
