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
  editableTask: Task = {} as Task;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    // Initialize editableTask to avoid "undefined" errors
    this.editableTask = { ...this.task };
  }

  /** Toggles the completion status of a task */
  toggleDone() {
    this.task.completed = !this.task.completed;
    this.taskService.updateTask(this.task);
    this.taskUpdated.emit(this.task);
  }

  deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskDeleted.emit(this.task.id);
    }
  }

  editTask() {
    this.isEditing = true;
    this.editableTask = { ...this.task }; // Copy current task values
  }

  saveEdit() {
    this.taskService.updateTask(this.editableTask);
    this.task = { ...this.editableTask }; // Update the current task with edited values
    this.taskUpdated.emit(this.task);
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }
  
  setPriority(priority: 'High' | 'Mid' | 'Low') {
    this.editableTask.priority = priority;
  }
}