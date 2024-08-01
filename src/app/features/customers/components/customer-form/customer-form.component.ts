import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { CustomerForm } from '../../models/customer.model';
import { CustomersService } from '../../services/customers.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BtnComponent],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent {
  customerForm: FormGroup<CustomerForm> = new FormGroup<CustomerForm>({
    civility: new FormControl('M', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl(''),
    company: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    country: new FormControl('France', Validators.required)
  });
  isLoading$ = this.customersService.isLoading$;
  errorMessages!: string;

  constructor(private customersService : CustomersService, private auth : AuthService, private router : Router) {}

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.errorMessages = 'Veuillez remplir tous les champs obligatoires.';
      return;
    } else {
      this.errorMessages = '';
    }

    this.auth.authState$.subscribe((user) => {
      if (user) {
        this.customersService.addCustomer(user.uid, this.customerForm);
      }

      this.customersService.errorMessages$.subscribe((error) => {
        if (error) {
          this.errorMessages = error;
        } else {
          this.router.navigate(['/customers']);
        }
      });
    });
 
  }

}
