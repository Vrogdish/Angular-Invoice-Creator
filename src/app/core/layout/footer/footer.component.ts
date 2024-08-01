import { Component } from '@angular/core';
import { BtnComponent } from "../../../shared/components/btn/btn.component";

@Component({
    selector: 'app-footer',
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    imports: [BtnComponent]
})
export class FooterComponent {

}
