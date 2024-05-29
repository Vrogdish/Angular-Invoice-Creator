import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  @Input() user!: User | null;
  @Input() size : 'small' | 'medium' | 'large' = 'medium';

}
