import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";

@Component({
    selector: 'app-burger',
    standalone: true,
    templateUrl: './burger.component.html',
    styleUrl: './burger.component.scss',
    imports: [CommonModule, MenuComponent]
})
export class BurgerComponent {
  menuIsOpen = false;

  toggleMenu() {
    this.menuIsOpen = !this.menuIsOpen;
  }

}
