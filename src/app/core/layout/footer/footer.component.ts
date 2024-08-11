import { Component } from '@angular/core';
import { BtnComponent } from "../../../shared/components/btn/btn.component";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    imports: [BtnComponent, RouterLink]
})
export class FooterComponent {

}
