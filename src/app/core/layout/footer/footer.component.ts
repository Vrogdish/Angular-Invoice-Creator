import { Component } from '@angular/core';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [BtnComponent, RouterLink, ReactiveFormsModule, CommonModule],
})
export class FooterComponent  {
  contactForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });
  errorMessage!: string;

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted');
    } else {
      this.errorMessage = 'adresse mail invalide';
    }
  }

 
}
