import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Customer } from '../../../customers/models/customer.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CustomersService } from '../../../customers/services/customers.service';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceForm } from '../../models/invoice.model';
import { ProfileService } from '../../../profile/services/profile.service';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';

@Component({
  selector: 'app-select-customer',
  standalone: true,
  imports: [NgSelectModule, FormsModule, CommonModule, FormsModule,BtnComponent],
  templateUrl: './select-customer.component.html',
  styleUrl: './select-customer.component.scss',
})
export class SelectCustomerComponent implements OnInit, OnDestroy {
  customers$!: BehaviorSubject<Customer[] | null>;
  selectedCustomer: Customer | null = null;
  invoice$!: BehaviorSubject<InvoiceForm>;
  subscription: Subscription = new Subscription();
  deliveryEditMode = false;

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private customersService: CustomersService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.auth.authState$.subscribe((user) => {
        if (user) {
          this.customersService.loadCustomers(user.uid);
          this.profileService.loadProfile(user.uid);
          this.profileService.profile$.subscribe((profile) => {
            if (profile) {
              this.invoiceService.initInvoice(profile);
            }
          });
        }
      })
    );
    this.customers$ = this.customersService.customers$;
    this.invoice$ = this.invoiceService.invoice$;
  }

 ngOnDestroy(): void {
   this.subscription.unsubscribe();
 }

  setCustomer(event: Customer): void {
    this.invoiceService.setCustomer(event);
  }

  resetCustomer(): void {
    this.invoiceService.resetCustomer();
  }

  setDelivery(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.invoiceService.setDelivery(inputElement.checked);
    if (inputElement.checked) {
      this.invoiceService.setDeliveryAddress({
        address: this.invoice$.value.customer.address,
        postalCode: this.invoice$.value.customer.postalCode,
        city: this.invoice$.value.customer.city,
        country: this.invoice$.value.customer.country,
      });
    } else {
      this.invoiceService.setDeliveryAddress({
        address: '',
        postalCode: '',
        city: '',
        country: '',
      });
    }
    ;
  }

  setDeliveryEditMode(value : boolean): void {
    this.deliveryEditMode = value;
  }

  setDeliveryAddress(event: Event): void {
    console.log('setDeliveryAddress', event);
    
        }

}
