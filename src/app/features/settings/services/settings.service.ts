import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settings$: BehaviorSubject<Settings> = new BehaviorSubject<Settings>({
    tva: 20,
    showLogo: false,
    showEmail: true,
    uid: '',
  });
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  createSettings(settings: Settings): void {
    this.settings$.next(settings);
  }

  loadSettings(uid : string): void {
    console.log('loadSettings', uid);
    
}

  updateSettings(settings: Settings): void {
    this.settings$.next(settings);
  }
}
