import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private showAddFormSubject = new BehaviorSubject<boolean>(false);
  showAddForm$ = this.showAddFormSubject.asObservable();

  constructor() {
    // Initialize with some tasks or load from localStorage
    this.loadTasks();
  }

  // Load tasks from localStorage
  private loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }

  // Save tasks to localStorage
  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Get all tasks
  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  // Add a new task
  addTask(task: Task): void {
    task.id = Date.now(); // Generate unique ID based on timestamp
    task.createdAt = new Date().toISOString(); // Add creation date
    this.tasks.push(task);
    this.saveTasks();
  }

  // Delete a task
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
  }

  // Update a task
  updateTask(updatedTask: Task): void {
    this.tasks = this.tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    this.saveTasks();
  }

  // Toggle add task form visibility
  toggleAddTaskForm(): void {
    this.showAddFormSubject.next(!this.showAddFormSubject.value);
  }

  // Close add task form
  closeAddTaskForm(): void {
    this.showAddFormSubject.next(false);
  }
}