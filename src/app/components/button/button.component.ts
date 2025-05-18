import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent implements OnInit{
  @Input() text: string;
  @Input() color?: string;
  @Output() btnClick = new EventEmitter();

  constructor(){
    this.text = '';
  }

  ngOnInit(): void {
      
  }

  onClick(){
    this.btnClick.emit();

  }
}
