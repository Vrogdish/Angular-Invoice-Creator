import { Component, OnInit } from '@angular/core';
import { BtnComponent } from "../../shared/components/btn/btn.component";
import { SettingsService } from './services/settings.service';
import { BehaviorSubject } from 'rxjs';
import { Settings } from './models/settings.model';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [BtnComponent, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  settings$ ! : BehaviorSubject<Settings>;
  isLoading$ ! : BehaviorSubject<boolean>;
  settingsForm : FormGroup = new FormGroup(
    {
      tva: new FormControl(0),
      showLogo: new FormControl(false),
      showEmail: new FormControl(false),
      uid: new FormControl(''),
    }
    
  );

  constructor(private settingService : SettingsService) { }

  ngOnInit(): void {
    this.settings$ = this.settingService.settings$;
    this.isLoading$ = this.settingService.isLoading$;
    this.settings$.subscribe((settings) => {
      this.settingsForm.patchValue(settings);
    });
  }

}
