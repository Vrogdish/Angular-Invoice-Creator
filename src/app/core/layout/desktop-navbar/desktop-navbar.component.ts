import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-desktop-navbar',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './desktop-navbar.component.html',
  styleUrl: './desktop-navbar.component.scss'
})
export class DesktopNavbarComponent {

}
