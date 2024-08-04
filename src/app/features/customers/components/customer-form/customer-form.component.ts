import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { Customer, CustomerForm } from '../../models/customer.model';
import { CustomersService } from '../../services/customers.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BtnComponent, RouterLink],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
})
export class CustomerFormComponent implements OnInit {
  @Input() customer!: Customer | null;
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
    country: new FormControl('France'),
  });
  isLoading$ = this.customersService.isLoading$;
  errorMessages!: string;
  editMode = false;

  constructor(
    private customersService: CustomersService,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((url) => {
      if (url[1].path === 'detail') {
        this.editMode = true;
        if (this.customer) {
          this.customerForm.patchValue(this.customer);
        }
      } else {
        this.editMode = false;
      }
    });
  }
  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.errorMessages = 'Veuillez remplir tous les champs obligatoires.';
      return;
    } else {
      this.errorMessages = '';
    }

    this.auth.authState$.subscribe((user) => {
      if (user) {
        if (this.editMode && this.customer) {
          this.customersService.updateCustomer(
            user.uid,
            this.customer.id,
            this.customerForm
          );
        } else {
          this.customersService.addCustomer(user.uid, this.customerForm);
        }
      }
      this.customersService.errorMessages$.subscribe((error) => {
        if (error) {
          this.errorMessages = error;
        }
      });
      if (!this.errorMessages) {
        this.router.navigate(['/customers']);
      }
    });
  }
}
