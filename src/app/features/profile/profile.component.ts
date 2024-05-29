import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { User } from 'firebase/auth';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { ProfileService } from './services/profile.service';
import { UserProfile } from './models/userProfile.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from "../../shared/components/avatar/avatar.component";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    imports: [BtnComponent, CommonModule, AvatarComponent, RouterLink]
})
export class ProfileComponent implements OnInit {
  user$!: Observable<User | null>;
  user! : User | null;
  userProfile$!: Observable<UserProfile | null>;

  constructor(private profile: ProfileService, private auth: AuthService) {
    this.user$ = this.auth.authState$;
    this.userProfile$ = this.profile.profile$;
  }

  ngOnInit() {
    this.auth.authState$.subscribe((user) => {
      if (user) {
        this.profile.loadProfile(user.uid);
        this.user = user;
      }
    });
  }

  signout() {
    this.auth.logout();
  }
}
