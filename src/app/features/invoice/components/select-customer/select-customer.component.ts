import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject } from 'rxjs';
import { Customer } from '../../../customers/models/customer.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CustomersService } from '../../../customers/services/customers.service';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice, InvoiceForm } from '../../models/invoice.model';
import { ProfileService } from '../../../profile/services/profile.service';

@Component({
  selector: 'app-select-customer',
  standalone: true,
  imports: [NgSelectModule, FormsModule, CommonModule],
  templateUrl: './select-customer.component.html',
  styleUrl: './select-customer.component.scss',
})
export class SelectCustomerComponent implements OnInit {
  customers$!: BehaviorSubject<Customer[] | null>;
  selectedCustomer: Customer | null = null;
  invoice$!: BehaviorSubject<InvoiceForm>;

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private customersService: CustomersService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
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
    });
    this.customers$ = this.customersService.customers$;
    this.invoice$ = this.invoiceService.invoice$;
  }

  setCustomer(event: Customer): void {
    this.invoiceService.setCustomer(event);
  }

  resetCustomer(): void {
    this.invoiceService.resetCustomer();
  }
}
