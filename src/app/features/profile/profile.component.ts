import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { User } from 'firebase/auth';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { ProfileService } from './services/profile.service';
import { UserProfile } from './models/userProfile.model';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [BtnComponent, CommonModule, AvatarComponent, RouterLink],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user$!: Observable<User | null>;
  user!: User | null;
  userProfile$!: Observable<UserProfile | null>;
  subscription: Subscription = new Subscription();

  constructor(private profile: ProfileService, private auth: AuthService) {
    this.user$ = this.auth.authState$;
    this.userProfile$ = this.profile.profile$;
  }

  ngOnInit() {
    this.subscription.add(
      this.auth.authState$.subscribe((user) => {
        if (user) {
          this.profile.loadProfile(user.uid);
          this.user = user;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  signout() {
    this.auth.logout();
  }
}
