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
  @Input() title: string = 'Button';
  @Input() iconUrl!: string;
  @Input() theme:
    | 'primary'
    | 'secondary'
    | 'submit'
    | 'disabled'
    | 'loading'
    | 'cancel'
    | 'alert' = 'primary';
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  typeVariant: 'submit' | 'button' = 'button' ;
  isDisabled = false;

  ngOnInit(): void {
    if (this.theme === 'submit') {
      this.typeVariant = 'submit';
    }

    if (this.theme === 'disabled' || this.theme === 'loading' ) {
      this.isDisabled = true;
    }
  }

  handleclick() {
    this.onClick.emit();
  }
}
