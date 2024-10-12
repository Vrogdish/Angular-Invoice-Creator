import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  imports: [ReactiveFormsModule, BtnComponent, RouterLink, CommonModule],
})
export class SignInComponent {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (!email || !password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const user = await this.auth.login(email, password);
      if (user.data) {
        this.router.navigate(['invoice']);
      } else {
        this.errorMessage = 'Email ou mot de passe incorrecte';
      }
    } catch (error) {
      this.errorMessage = 'Erreur inconnue, veuillez réessayer';
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
