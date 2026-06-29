export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Open' | 'In Progress' | 'Testing' | 'Done';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date;
  createdBy: number;
  assignedTo: number;
  createdAt: Date;
}