"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepo = void 0;
const db_1 = require("../config/db");
exports.userRepo = {
    async findByEmail(email) {
        const res = await (0, db_1.query)('SELECT id, name, email, password_hash AS "passwordHash", role, created_at AS "createdAt" FROM users WHERE email = $1', [email]);
        return res.rows[0] || null;
    },
    async createUser(name, email, passwordHash, role = 'User') {
        const res = await (0, db_1.query)(`INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, password_hash AS "passwordHash", role, created_at AS "createdAt"`, [name, email, passwordHash, role]);
        return res.rows[0];
    },
    async findById(id) {
        const res = await (0, db_1.query)('SELECT id, name, email, password_hash AS "passwordHash", role, created_at AS "createdAt" FROM users WHERE id = $1', [id]);
        return res.rows[0] || null;
    },
    async getAllUsers() {
        const res = await (0, db_1.query)('SELECT id, name, email, password_hash AS "passwordHash", role, created_at AS "createdAt" FROM users ORDER BY created_at DESC');
        return res.rows;
    },
    async updateUser(id, updates) {
        // Build dynamic SET clause based on provided fields
        const fields = [];
        const values = [];
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
        const res = await (0, db_1.query)(sql, values);
        return res.rows[0] || null;
    },
    async deleteUser(id) {
        await (0, db_1.query)('DELETE FROM users WHERE id = $1', [id]);
    },
};
