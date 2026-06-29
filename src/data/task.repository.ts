import { query } from '@config/db';
import { Task, TaskPriority, TaskStatus } from '@models/task.model';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  title?: string;
  createdBy?: number;
  assignedTo?: number;
}

export const taskRepo = {
  async createTask(data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: Date;
    createdBy: number;
    assignedTo: number;
  }): Promise<Task> {
    const res = await query(
      `INSERT INTO tasks (title, description, priority, status, due_date, created_by, assigned_to)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, priority, status,
                 due_date AS "dueDate",
                 created_by AS "createdBy",
                 assigned_to AS "assignedTo",
                 created_at AS "createdAt"`,
      [
        data.title,
        data.description,
        data.priority,
        data.status,
        data.dueDate,
        data.createdBy,
        data.assignedTo,
      ],
    );
    return res.rows[0];
  },

  async findById(id: number): Promise<Task | null> {
    const res = await query(
      `SELECT id, title, description, priority, status,
              due_date AS "dueDate",
              created_by AS "createdBy",
              assigned_to AS "assignedTo",
              created_at AS "createdAt"
       FROM tasks
       WHERE id = $1`,
      [id],
    );
    return res.rows[0] || null;
  },

  async updateTask(id: number, fields: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    // For readability, you can build dynamic SET clause, or accept limited fields.
    const res = await query(
      `UPDATE tasks
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           priority = COALESCE($4, priority),
           status = COALESCE($5, status),
           due_date = COALESCE($6, due_date),
           assigned_to = COALESCE($7, assigned_to)
       WHERE id = $1
       RETURNING id, title, description, priority, status,
                 due_date AS "dueDate",
                 created_by AS "createdBy",
                 assigned_to AS "assignedTo",
                 created_at AS "createdAt"`,
      [
        id,
        fields.title ?? null,
        fields.description ?? null,
        fields.priority ?? null,
        fields.status ?? null,
        fields.dueDate ?? null,
        fields.assignedTo ?? null,
      ],
    );
    return res.rows[0] || null;
  },

  async deleteTask(id: number): Promise<void> {
    await query('DELETE FROM tasks WHERE id = $1', [id]);
  },

  async findTasks(filters: TaskFilters, isAdmin: boolean, userId: number): Promise<Task[]> {
    const clauses: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.status) {
      clauses.push(`status = $${paramIndex++}`);
      params.push(filters.status);
    }
    if (filters.priority) {
      clauses.push(`priority = $${paramIndex++}`);
      params.push(filters.priority);
    }
    if (filters.title) {
      clauses.push(`title ILIKE $${paramIndex++}`);
      params.push(`%${filters.title}%`);
    }

    // Role-based filter: if not admin, restrict to createdBy or assignedTo.
    if (!isAdmin) {
      clauses.push(`(created_by = $${paramIndex} OR assigned_to = $${paramIndex})`);
      params.push(userId);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const res = await query(
      `SELECT id, title, description, priority, status,
              due_date AS "dueDate",
              created_by AS "createdBy",
              assigned_to AS "assignedTo",
              created_at AS "createdAt"
       FROM tasks
       ${where}
       ORDER BY due_date ASC`,
      params,
    );
    return res.rows;
  },
};