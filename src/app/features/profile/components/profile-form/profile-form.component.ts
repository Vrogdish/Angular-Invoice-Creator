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

@Component({
  selector: 'app-profile-form',
  standalone: true,
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
  imports: [ReactiveFormsModule, BtnComponent, RouterLink],
})
export class ProfileFormComponent implements OnInit {
  profileForm: FormGroup<UserProfileForm> = new FormGroup<UserProfileForm>({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    civility: new FormControl('', Validators.required),
    company: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
    postalCode: new FormControl(''),
    phoneNumber: new FormControl(''),
  });

  userProfile!: UserProfile;

  ngOnInit() {
    this.profile.profile$.subscribe((profile) => {
      if (profile) {
        this.userProfile = profile;
        this.profileForm.patchValue(profile);
      }
    });
  }

  constructor(private profile: ProfileService, private router : Router) {}

  async onSubmit() {
    await this.profile.updateProfile(this.userProfile.id, this.profileForm);
    await this.profile.loadProfile(this.userProfile.uid);
    this.router.navigate(['profile']);
  }
}
