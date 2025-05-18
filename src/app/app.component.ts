import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { Task } from './models/task';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TaskListComponent, AddTaskComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showAddTaskForm: boolean = false;

  constructor(private taskService: TaskService) {
    this.taskService.showAddForm$.subscribe(
      (value) => (this.showAddTaskForm = value)
    );
  }

  onTaskAdded(task: Task) {
    this.showAddTaskForm = false;
  }
}