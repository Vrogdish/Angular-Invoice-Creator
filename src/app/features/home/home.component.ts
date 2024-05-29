import { Component } from '@angular/core';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [BtnComponent, CommonModule, RouterLink],
})
export class HomeComponent {
  user!: User | null;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.authState$.subscribe((user) => {
      this.user = user;
    });
  }
}
