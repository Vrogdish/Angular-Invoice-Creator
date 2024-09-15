import { FormControl } from "@angular/forms";
import { CivilityEnum } from "./civility.model";

export interface Contact {
    civility: CivilityEnum;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
}

export interface ContactForm {
    civility : FormControl<string | null>,
    firstName : FormControl<string | null>,
    lastName : FormControl<string | null>,
    company : FormControl<string | null>,
    email : FormControl<string | null>,
    phone : FormControl<string | null>,
    address : FormControl<string | null>,
    postalCode : FormControl<string | null>,
    city : FormControl<string | null>,
    country : FormControl<string | null>
}
  