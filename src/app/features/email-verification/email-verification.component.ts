import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { User } from 'firebase/auth';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [BtnComponent, CommonModule],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss',
})
export class EmailVerificationComponent implements OnInit {
  user!: User | null;
  isLoading = false;

  constructor(private auth: AuthService, private router : Router) {}

  ngOnInit() {
    this.auth.authState$.subscribe((user) => {
      this.user = user;
    });
  }
  resendVerificationEmail() {
    this.isLoading = true;
    this.auth.sendVerificationEmail();
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
