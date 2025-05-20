import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnChanges {
  @Input() selectedTime: string = '';
  @Output() selectedTimeChange = new EventEmitter<string>();
  
  showTimePicker: boolean = false;
  selectedHour: number = 12;
  selectedMinute: number = 0;
  period: 'AM' | 'PM' = 'AM';
  
  constructor() {
    this.parseInputTime();
  }

  ngOnChanges() {
    this.parseInputTime();
  }
  
  parseInputTime() {
    if (this.selectedTime) {
      const timeParts = this.selectedTime.split(':');
      if (timeParts.length >= 2) {
        let hour = parseInt(timeParts[0], 10);
        const minute = parseInt(timeParts[1], 10);
        
        if (hour >= 12) {
          this.period = 'PM';
          if (hour > 12) {
            hour -= 12;
          }
        } else {
          this.period = 'AM';
          if (hour === 0) {
            hour = 12;
          }
        }
        
        this.selectedHour = hour;
        this.selectedMinute = minute;
      }
    } else {
      const now = new Date();
      this.selectedHour = now.getHours() % 12 || 12;
      this.selectedMinute = now.getMinutes();
      this.period = now.getHours() >= 12 ? 'PM' : 'AM';
    }
  }
  
  get formattedTime(): string {
    if (!this.selectedTime) {
      return '';
    }
    
    return `${this.selectedHour.toString().padStart(2, '0')}:${this.selectedMinute.toString().padStart(2, '0')} ${this.period}`;
  }
  
  toggleTimePicker() {
    this.showTimePicker = !this.showTimePicker;
  }
  
  changeHour(step: number) {
    this.selectedHour += step;
    if (this.selectedHour > 12) {
      this.selectedHour = 1;
    } else if (this.selectedHour < 1) {
      this.selectedHour = 12;
    }
  }
  
  changeMinute(step: number) {
    this.selectedMinute += step;
    if (this.selectedMinute >= 60) {
      this.selectedMinute = 0;
    } else if (this.selectedMinute < 0) {
      this.selectedMinute = 59;
    }
  }
  
  togglePeriod() {
    this.period = this.period === 'AM' ? 'PM' : 'AM';
  }
  
  clearTime() {
    this.selectedTime = '';
    this.selectedTimeChange.emit('');
    this.showTimePicker = false;
  }
  
  applyTime() {
    let hour = this.selectedHour;
    if (this.period === 'PM' && hour < 12) {
      hour += 12;
    } else if (this.period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    const formattedTime = `${hour.toString().padStart(2, '0')}:${this.selectedMinute.toString().padStart(2, '0')}`;
    this.selectedTime = formattedTime;
    this.selectedTimeChange.emit(formattedTime);
    this.showTimePicker = false;
  }
}