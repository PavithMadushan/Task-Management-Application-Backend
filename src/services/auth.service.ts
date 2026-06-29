import jwt from 'jsonwebtoken';
import { env } from '@config/env';
import { userRepo } from '@data/user.repository';
import { hashPassword, comparePassword } from '@utils/password';
import { HttpError } from '@utils/httpErrors';

export const authService = {
  async register(name: string, email: string, password: string) {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new HttpError(409, 'Email already in use');

    const passwordHash = await hashPassword(password);
    const user = await userRepo.createUser(name, email, passwordHash, 'User');
    const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, {
      expiresIn: '1d',
    });
    return { user, token };
  },

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new HttpError(401, 'Invalid credentials');

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new HttpError(401, 'Invalid credentials');

    const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, {
      expiresIn: '1d',
    });
    return { user, token };
  },
};