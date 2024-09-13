import { Component,  OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject } from 'rxjs';
import { Customer } from '../../../customers/models/customer.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CustomersService } from '../../../customers/services/customers.service';
import { InvoiceForm } from '../../models/invoice.model';
import { ProfileService } from '../../../profile/services/profile.service';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { DeliveryAddressFormComponent } from '../delivery-address-form/delivery-address-form.component';
import { InvoiceCreatorService } from '../../services/invoice-creator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-customer',
  standalone: true,
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    CommonModule,
    BtnComponent,
    DeliveryAddressFormComponent,
  ],
  templateUrl: './select-customer.component.html',
  styleUrl: './select-customer.component.scss',
})
export class SelectCustomerComponent implements OnInit {
  customers$!: BehaviorSubject<Customer[] | null>;
  selectedCustomer: Customer | null = null;
  invoice$!: BehaviorSubject<InvoiceForm>;
  deliveryEditMode = false;

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private customersService: CustomersService,
    private invoiceCreatorService: InvoiceCreatorService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.customers$ = this.customersService.customers$;
    this.invoice$ = this.invoiceCreatorService.invoice$;
  }

    setCustomer(event: Customer): void {
    this.invoiceCreatorService.setCustomer(event);
    if (this.invoice$.value.delivery.withDelivery) {
      this.invoiceCreatorService.updateDeliveryAddress({
        address: event.address,
        postalCode: event.postalCode,
        city: event.city,
        country: event.country,
      });
    }
  }

  resetCustomer(): void {
    this.invoiceCreatorService.resetCustomer();
    this.invoiceCreatorService.setDelivery(false);
  }

  setDelivery(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.invoiceCreatorService.setDelivery(inputElement.checked);
    if (inputElement.checked) {
      this.invoiceCreatorService.updateDeliveryAddress({
        address: this.invoice$.value.customer.address,
        postalCode: this.invoice$.value.customer.postalCode,
        city: this.invoice$.value.customer.city,
        country: this.invoice$.value.customer.country,
      });
    }
  }

next(){
  this.invoiceCreatorService.setStep(2)
}

previous(){
  this.invoiceCreatorService.resetInvoice()
  this.router.navigate(['/invoice'])
}


}
