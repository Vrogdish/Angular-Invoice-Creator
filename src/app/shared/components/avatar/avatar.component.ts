import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../features/profile/models/userProfile.model';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  @Input() userProfile!: UserProfile | null;
  @Input() size : 'small' | 'medium' | 'large' = 'medium';

}
