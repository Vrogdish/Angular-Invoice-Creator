import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserProfile, UserProfileForm } from '../../models/userProfile.model';
import { ProfileService } from '../../services/profile.service';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
  imports: [ReactiveFormsModule, BtnComponent, RouterLink, CommonModule],
})
export class ProfileFormComponent implements OnInit {
  profileForm: FormGroup<UserProfileForm> = new FormGroup<UserProfileForm>({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    civility: new FormControl('', Validators.required),
    company: new FormControl(''),
    address: new FormControl('', Validators.required),
    city: new FormControl(''),
    postalCode: new FormControl(''),
    phoneNumber: new FormControl(''),
  });

  userProfile!: UserProfile;
  isLoading$ = this.profile.isLoading$;
  errorMessages!: string;

  ngOnInit() {
    this.profile.profile$.subscribe((profile) => {
      if (profile) {
        this.userProfile = profile;
        this.profileForm.patchValue(profile);
      }
    });
  }

  constructor(private profile: ProfileService, private router: Router) {}

  async onSubmit() {
    if (this.profileForm.invalid) {
      this.errorMessages = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    
    await this.profile.updateProfile(this.userProfile.id, this.profileForm);
    await this.profile.loadProfile(this.userProfile.uid);

   this.profile.errorMessages$.subscribe((error) => {
     if (error) {
       this.errorMessages = error;
     } else {
       this.router.navigate(['/profile']);
     }
   });
  }
}
