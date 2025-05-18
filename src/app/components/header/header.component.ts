import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule],
})
export class HeaderComponent {
  title = 'Task Tracker';
  
  constructor(private taskService: TaskService) {}
  
  toggleAddTask() {
    this.taskService.toggleAddTaskForm();
  }
}