import { Component, OnDestroy, OnInit } from '@angular/core';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [BtnComponent, CommonModule, RouterLink],
})
export class HomeComponent implements OnInit, OnDestroy {
  user!: User | null;
  subscription : Subscription = new Subscription();
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.subscription.add(this.auth.authState$.subscribe((user) => {
      this.user = user;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
