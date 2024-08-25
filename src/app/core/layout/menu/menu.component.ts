import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { AuthService } from '../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  imports: [CommonModule, RouterModule, BtnComponent],
})
export class MenuComponent implements OnInit {
  @Output() handleClose = new EventEmitter<void>();
  user$!: Observable<User | null>;

  offlineMenu = [
    {
      title: 'Accueil',
      icons: '/icons/home.png',
      link: '',
    },
    {
      title: 'Aide et contact',
      icons: '/icons/help.png',
      link: '/help',
    },
  ];
  onlineMenu = [
     {
      title: 'Mes factures',
      icons: '/icons/invoice.png',
      link: '/invoice',
    },
    {
      title: 'Mes produits',
      icons: '/icons/product.png',
      link: '/products',
    },
    {
      title: 'Mes clients',
      icons: '/icons/user.png',
      link: '/customers',
    },
    {
      title: 'Paramètres',
      icons: '/icons/setting.png',
      link: '/settings',
    },
    {
      title: 'Aide et contact',
      icons: '/icons/help.png',
      link: '/help',
    }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user$ = this.auth.authState$;
  }

  closeMenu() {
    this.handleClose.emit();
  }
}
