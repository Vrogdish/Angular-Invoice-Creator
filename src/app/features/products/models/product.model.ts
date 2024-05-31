import { FormControl } from "@angular/forms";

export interface Product {
    id: string;
    uid: string;
    name: string;
    description: string;
    price: number;
    reference: string;
}

export interface ProductForm {
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    price: FormControl<string | null>;
    reference: FormControl<string | null>;
}

