import { FormControl } from '@angular/forms';
import { CivilityEnum } from '../../../shared/models/civility.model';

export interface Customer {
  id: string;
  uid: string;
  civility: CivilityEnum;
  firstname: string;
  lastname: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface CustomerForm {
  civility: FormControl<string | null>;
  firstname: FormControl<string | null>;
  lastname: FormControl<string | null>;
  email: FormControl<string | null>;
  company: FormControl<string | null>;
  phone: FormControl<string | null>;
  address: FormControl<string | null>;
  postalCode: FormControl<string | null>;
  city: FormControl<string | null>;
  country: FormControl<string | null>;
}
