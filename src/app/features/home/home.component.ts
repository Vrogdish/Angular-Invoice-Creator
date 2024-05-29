import { Component } from '@angular/core';
import { BtnComponent } from "../../shared/components/btn/btn.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [BtnComponent]
})
export class HomeComponent {

}
