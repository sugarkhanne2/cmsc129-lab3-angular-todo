import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { TimePickerComponent } from '../time-picker/time-picker.component';

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
  imports: [CommonModule, FormsModule, TimePickerComponent],
})
export class AddTaskComponent {
  @Output() taskAdded = new EventEmitter<Task>();
  
  title: string = '';
  dueDate: string = '';
  dueTime: string = '';
  priority: 'High' | 'Mid' | 'Low' = 'Low';
  
  constructor(private taskService: TaskService) {}
  
  onSubmit() {
    if (!this.title) {
      alert('Please add a task title!');
      return;
    }
    
    const newTask: Task = {
      id: Date.now(),
      title: this.title,
      dueDate: this.dueDate,
      dueTime: this.dueTime,
      priority: this.priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    // Add task via service
    this.taskService.addTask(newTask);
    
    // Emit event
    this.taskAdded.emit(newTask);
    
    // Close the form
    this.taskService.closeAddTaskForm();
    
    // Reset form
    this.resetForm();
  }
  
  resetForm() {
    this.title = '';
    this.dueDate = '';
    this.dueTime = '';
    this.priority = 'Mid';
  }
  
  onCancel() {
    this.resetForm();
    this.taskService.closeAddTaskForm();
  }
  
  setPriority(priority: 'High' | 'Mid' | 'Low') {
    this.priority = priority;
  }
}