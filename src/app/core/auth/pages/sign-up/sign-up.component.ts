import { Component } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../../features/profile/services/profile.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  imports: [ReactiveFormsModule, BtnComponent, CommonModule],
})
export class SignUpComponent {
  signupForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private profile: ProfileService
  ) {}

  async onSubmit() {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    const email = this.signupForm.get('email')?.value;
    const firstname = this.signupForm.get('firstname')?.value;
    const lastname = this.signupForm.get('lastname')?.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!email || !password || !confirmPassword || !firstname || !lastname) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const user = await this.auth.signup(email, password);
      if (user.data) {
        await this.profile.createProfile(
          user.data.uid,
          firstname,
          lastname,
          email
        );
        alert('Inscription réussie');
        this.router.navigate(['profile/edit']);
      } else {
        this.errorMessage = 'Erreur inconnue, veuillez réessayer';
      }
    } catch (error) {
      this.errorMessage = 'Erreur inconnue, veuillez réessayer';
      console.error(error);
    }
  }
}
