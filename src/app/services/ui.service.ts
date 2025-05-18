import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UiService {
  private showAddTask: boolean = false;
  private subject = new BehaviorSubject<boolean>(false);
  private cancelSubject = new Subject<void>();

  constructor() { }

  toggleAddTask(): void{
    this.showAddTask = !this.showAddTask;
    this.subject.next(this.showAddTask);

    if(!this.showAddTask){
      this.cancelSubject.next();
    }
  }

  onToggle(): Observable<any>{
    return this.subject.asObservable();
  }

  onCancel(): Observable<void>{
    return this.cancelSubject.asObservable();
  }
}
