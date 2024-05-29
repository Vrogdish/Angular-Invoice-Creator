import { Component, OnInit } from '@angular/core';
import { BurgerComponent } from '../burger/burger.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [BurgerComponent, AvatarComponent, RouterLink, CommonModule],
})
export class HeaderComponent implements OnInit {
  user$!: Observable<User | null>;
  constructor(private auth: AuthService) {}
  ngOnInit() {
    this.user$ = this.auth.authState$;
  }
}
