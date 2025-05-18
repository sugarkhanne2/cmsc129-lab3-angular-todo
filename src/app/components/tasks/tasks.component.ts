import { Component } from '@angular/core';
import {Task} from '../../Task';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from "../task-item/task-item.component";
import { AddTaskComponent } from "../add-task/add-task.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, TaskItemComponent, AddTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  tasks: Task[] = [];
  taskToEdit: Task | null = null;
  sortBy: string = 'dateCreatedDesc';

  constructor(private taskService: TaskService, private snackBar: MatSnackBar){}

  ngOnInit(): void{
    this.taskService.getTasks().subscribe((tasks) => {this.tasks = tasks; this.sortTasks();});
  }

  editTask(task: Task){
    this.taskToEdit = {...task};
  }

  updateTask(task: Task){
    this.taskService.updateTaskReminder(task).subscribe(() => {
      this.tasks = this.tasks.map((t) => t.id === task.id ? task : t);
      this.sortTasks();
      this.taskToEdit = null;
    })
  }

  deleteTask(task: Task){
    this.tasks = this.tasks.filter((t) => t.id! != task.id);
    const toast = this.snackBar.open('Task successfully deleted', 'Undo', {
      duration: 3000,
    });

    toast.onAction().subscribe(() => {
      this.tasks.push(task);
      this.sortTasks();
    });

    setTimeout(() => {
      if(!this.tasks.includes(task)) {
        this.taskService.deleteTask(task).subscribe();
        this.sortTasks();
      }
    }, 3000);
    

  }

  addTask(task: Task){
    this.taskService.addTask(task).subscribe((task) => {this.tasks.push(task); this.sortTasks();});
    
  }

  sortTasks(){
    const priorityOrder = { high: 1, mid: 2, low: 3 };
    this.tasks = [...this.tasks].sort((a,b) => {

      if(a.isDone !== b.isDone){
        return a.isDone ? 1: -1;
      }

      switch(this.sortBy){
        case 'dateCreatedDesc': 
          return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
        case 'dueDateEarly':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priorityHigh':
          return priorityOrder[a.priority as 'high' | 'mid' | 'low'] - priorityOrder[b.priority as 'high' | 'mid' | 'low'];
        case 'priorityLow':
          return priorityOrder[b.priority as 'high' | 'mid' | 'low'] - priorityOrder[a.priority as 'high' | 'mid' | 'low'];
        case 'dateCreatedAsc':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        case 'dueDateLate':
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();

        default:
          return 0;
      }
    });
  }

   changeSort(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value;
    this.sortTasks();
  }

  toggleReminder(task: Task){
    task.isDone = !task.isDone;
    this.taskService.updateTaskReminder(task).subscribe();
    this.sortTasks();
  }
}
