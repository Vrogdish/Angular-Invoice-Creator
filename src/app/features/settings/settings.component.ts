import { Component, OnDestroy, OnInit } from '@angular/core';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { SettingsService } from './services/settings.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Settings } from './models/settings.model';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [BtnComponent, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
  settings$!: BehaviorSubject<Settings>;
  isLoading$!: BehaviorSubject<boolean>;
  settingsForm: FormGroup = new FormGroup({
    tva: new FormControl(0, [Validators.required, Validators.min(0)]),
    showLogo: new FormControl(false),
    showEmail: new FormControl(false),
    uid: new FormControl(''),
  });
  subscription: Subscription = new Subscription();

  constructor(private settingService: SettingsService) {}

  ngOnInit(): void {
    this.settings$ = this.settingService.settings$;
    this.isLoading$ = this.settingService.isLoading$;
    this.subscription.add(
      this.settings$.subscribe((settings) => {
        this.settingsForm.patchValue(settings);
      })
    );
    this.settingsForm.disable();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
