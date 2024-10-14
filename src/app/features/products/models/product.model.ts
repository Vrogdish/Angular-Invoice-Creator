import { FormControl } from "@angular/forms";

export enum TvaEnum {
    Normal = 20,
    intermediaire = 10,
    reduit = 5.5,
    particulier = 2.1
}

export interface Product {
    id: string;
    reference: string;
    name: string;
    description: string;
    price: number;
    tva : TvaEnum;
    uid?: string;
}

export interface ProductForm {
    reference: FormControl<string | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    price: FormControl<number | null>;
    tva: FormControl<TvaEnum | null>;
}

