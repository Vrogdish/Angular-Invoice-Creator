import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.scss',
})
export class BtnComponent implements OnInit{
  @Input() title = 'Button';
  @Input() iconUrl!: string;
  @Input() theme:
    | 'primary'
    | 'secondary'
    | 'submit'
    | 'loading'
    | 'cancel'
    | 'alert' = 'primary';
  @Input()isDisabled = false;
  @Output() handleClick: EventEmitter<void> = new EventEmitter<void>();
  typeVariant: 'submit' | 'button' = 'button' ;

  ngOnInit(): void {
    if (this.theme === 'submit') {
      this.typeVariant = 'submit';
    }
       
  }

  handleclick() {
    this.handleClick.emit();
    
  }
}
