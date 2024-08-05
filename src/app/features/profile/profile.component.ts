import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { User } from 'firebase/auth';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { ProfileService } from './services/profile.service';
import { UserProfile } from './models/userProfile.model';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [BtnComponent, CommonModule, AvatarComponent, RouterLink, LoaderComponent],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user!: User | null;
  userProfile$!: Observable<UserProfile | null>;
  subscription: Subscription = new Subscription();
  isLoading = true;

  constructor(private profile: ProfileService, private auth: AuthService, private router : Router) {}   
  

  ngOnInit() {
    this.subscription.add(
      this.auth.authState$.subscribe((user) => {
          this.user = user;
       
      })
    );
    this.userProfile$ = this.profile.profile$;
    this.subscription.add(
      this.profile.isLoading$.subscribe((isLoading) => {
        this.isLoading = isLoading;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  signout() {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }
}
