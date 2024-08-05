import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset',
  standalone: true,
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss',
  imports: [ReactiveFormsModule, BtnComponent, RouterLink],
})
export class ResetComponent {
  resetForm: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.resetPassword(this.resetForm.value.email);
    alert('Un email vous a été envoyé pour réinitialiser votre mot de passe.');
    this.router.navigate(['/signin']);
  }
}
