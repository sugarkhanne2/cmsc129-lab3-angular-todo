import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule, TaskItemComponent, MatSnackBarModule],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  sortBy: string = 'dateAdded'; // Default sorting method
  sortDirection: 'asc' | 'desc' = 'desc'; // Default sort direction

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.sortTasks();
    });
  }

  deleteTask(taskId: number) {
    const deletedTaskIndex = this.tasks.findIndex((task) => task.id === taskId);
    if (deletedTaskIndex === -1) return;

    const deletedTask = this.tasks[deletedTaskIndex];
    this.tasks.splice(deletedTaskIndex, 1);

    const snackBarRef = this.snackBar.open('Task Deleted', 'Undo', {
      duration: 5000,
    });

    snackBarRef.onAction().subscribe(() => {
      this.tasks.splice(deletedTaskIndex, 0, deletedTask);
      this.taskService.addTask(deletedTask);
    });

    this.taskService.deleteTask(taskId);
  }

  updateTask(updatedTask: Task) {
    this.taskService.updateTask(updatedTask);
    this.sortTasks();
  }

  setSortBy(sortMethod: string) {
    // If clicking the same sort method again, toggle direction
    if (this.sortBy === sortMethod) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // For new sort method, set default direction
      this.sortBy = sortMethod;
      // Default directions based on what makes sense for each type
      if (sortMethod === 'dateAdded') {
        this.sortDirection = 'desc'; // Newest first
      } else if (sortMethod === 'dueDate') {
        this.sortDirection = 'asc'; // Earliest due date first
      } else if (sortMethod === 'priority') {
        this.sortDirection = 'desc'; // Highest priority first
      }
    }
    this.sortTasks();
  }

  getPriorityValue(priority: string): number {
    switch (priority) {
      case 'High':
        return 3;
      case 'Mid':
        return 2;
      case 'Low':
        return 1;
      default:
        return 0;
    }
  }

  sortTasks() {
    if (this.sortBy === 'dateAdded') {
      this.tasks.sort((a, b) => {
        const comparison = new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        return this.sortDirection === 'asc' ? -comparison : comparison;
      });
    } else if (this.sortBy === 'dueDate') {
      this.tasks.sort((a, b) => {
        const dateA = a.dueDate ? new Date(`${a.dueDate} ${a.dueTime || '00:00'}`).getTime() : 0;
        const dateB = b.dueDate ? new Date(`${b.dueDate} ${b.dueTime || '00:00'}`).getTime() : 0;
        const comparison = dateA - dateB;
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    } else if (this.sortBy === 'priority') {
      this.tasks.sort((a, b) => {
        const comparison = this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority);
        return this.sortDirection === 'asc' ? -comparison : comparison;
      });
    }
  }
}