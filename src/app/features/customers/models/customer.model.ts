import { FormControl } from '@angular/forms';

export interface Customer {
  id: string;
  uid: string;
  civility: string;
  firstname: string;
  lastname: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  postalCode: string;
  locality: string;
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
  locality: FormControl<string | null>;
}
