import { FormControl } from '@angular/forms';
import { CivilityEnum } from '../../../shared/models/civility.model';

export interface UserProfile {
  id:string
  uid: string;
  firstname: string;
  lastname: string;
  civility: CivilityEnum;
  email: string;
  company?: string;
  imageUrl?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserProfileForm {
  firstname: FormControl<string | null>;
  lastname: FormControl<string | null>;
  civility: FormControl<string | null>;
  email?: FormControl<string | null>;
  company?: FormControl<string | null>;
  imageUrl?: FormControl<string | null>;
  address: FormControl<string | null>;
  city: FormControl<string | null>;
  postalCode: FormControl<string | null>;
  country?: FormControl<string | null>;
  phoneNumber?: FormControl<string | null>;
}
