import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  standalone: true,
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
  imports: [CommonModule, FormsModule],
})
export class TaskItemComponent {
  @Input() task!: Task; //Receives task data
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() taskUpdated = new EventEmitter<Task>();

  isEditing = false;
  showDeleteDialog = false;
  editableTask: Task = {} as Task;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.editableTask = { ...this.task };
  }

  toggleDone() {
    this.task.completed = !this.task.completed;
    this.taskService.updateTask(this.task);
    this.taskUpdated.emit(this.task);
  }

  openDeleteDialog() {
    this.showDeleteDialog = true;
  }

  /** Confirms task deletion */
  confirmDelete() {
    this.taskDeleted.emit(this.task.id);
    this.showDeleteDialog = false;
  }

  /** Cancels the delete action */
  cancelDelete() {
    this.showDeleteDialog = false;
  }

  editTask() {
    this.isEditing = true;
    this.editableTask = { ...this.task }; 
  }

  saveEdit() {
    this.taskService.updateTask(this.editableTask);
    this.task = { ...this.editableTask }; 
    this.taskUpdated.emit(this.task);
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }
  
  setPriority(priority: 'High' | 'Mid' | 'Low') {
    this.editableTask.priority = priority;
  }

  formatTimeWithAmPm(time: string): string {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) return time;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}