import { userRepo } from '../data/user.repository';
import type { UserRole } from '@models/user.model'; // adjust if you have a separate type file

export const userService = {
  async updateUser(
    id: number,
    updates: { name?: string; email?: string; role?: UserRole },
  ) {
    const updated = await userRepo.updateUser(id, updates);
    if (!updated) {
      return null;
    }

    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  },

  async deleteUser(id: number) {
    const existing = await userRepo.findById(id);
    if (!existing) {
      return false;
    }
    await userRepo.deleteUser(id);
    return true;
  },
};