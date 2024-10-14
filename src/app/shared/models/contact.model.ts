import { FormControl } from "@angular/forms";
import { CivilityEnum } from "./civility.model";

export interface Contact {
    id?: string;
    civility: CivilityEnum;
    firstname: string;
    lastname: string;
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
    firstname : FormControl<string | null>,
    lastname : FormControl<string | null>,
    company : FormControl<string | null>,
    email : FormControl<string | null>,
    phone : FormControl<string | null>,
    address : FormControl<string | null>,
    postalCode : FormControl<string | null>,
    city : FormControl<string | null>,
    country : FormControl<string | null>
}
  