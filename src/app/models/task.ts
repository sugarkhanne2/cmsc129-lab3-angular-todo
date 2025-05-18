export interface Task {
  id: number;
  title: string;
  dueDate: string;
  dueTime: string;
  priority: 'High' | 'Mid' | 'Low';
  completed: boolean;
  createdAt: string;
}
