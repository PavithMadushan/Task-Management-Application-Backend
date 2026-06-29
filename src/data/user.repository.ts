import { query } from '@config/db';
import { User, UserRole } from '@models/user.model';

export const userRepo = {
  async findByEmail(email: string): Promise<User | null> {
    const res = await query(
      'SELECT id, name, email, password_hash AS "passwordHash", role, created_at AS "createdAt" FROM users WHERE email = $1',
      [email],
    );
    return res.rows[0] || null;
  },

  async createUser(
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole = 'User',
  ): Promise<User> {
    const res = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, password_hash AS "passwordHash", role, created_at AS "createdAt"`,
      [name, email, passwordHash, role],
    );
    return res.rows[0];
  },

  async findById(id: number): Promise<User | null> {
    const res = await query(
      'SELECT id, name, email, password_hash AS "passwordHash", role, created_at AS "createdAt" FROM users WHERE id = $1',
      [id],
    );
    return res.rows[0] || null;
  },

  async getAllUsers(): Promise<User[]> {
    const res = await query(
      'SELECT id, name, email, password_hash AS "passwordHash", role, created_at AS "createdAt" FROM users ORDER BY created_at DESC',
    );
    return res.rows;
  },

  async updateUser(
    id: number,
    updates: { name?: string; email?: string; role?: UserRole },
  ): Promise<User | null> {
    // Build dynamic SET clause based on provided fields
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(updates.email);
    }
    if (updates.role !== undefined) {
      fields.push(`role = $${paramIndex++}`);
      values.push(updates.role);
    }

    if (fields.length === 0) {
      // nothing to update; return current row
      return await this.findById(id);
    }

    values.push(id); // last param is id

    const sql = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, email, password_hash AS "passwordHash", role, created_at AS "createdAt"
    `;

    const res = await query(sql, values);
    return res.rows[0] || null;
  },

  async deleteUser(id: number): Promise<void> {
    await query('DELETE FROM users WHERE id = $1', [id]);
  },
};