import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject } from 'rxjs';
import { Customer } from '../../../customers/models/customer.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomersService } from '../../../customers/services/customers.service';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { DocumentDetail } from '../../models/document-detail.model';
import { DocumentMakerService } from '../../services/document-maker.service';
import { DeliveryAddressFormComponent } from '../delivery-address-form/delivery-address-form.component';

@Component({
  selector: 'app-select-customer',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, CommonModule, BtnComponent, DeliveryAddressFormComponent],
  templateUrl: './select-customer.component.html',
  styleUrl: './select-customer.component.scss',
})
export class SelectCustomerComponent implements OnInit {
  customers$!: BehaviorSubject<Customer[] | null>;
  selectedCustomer: Customer | null = null;
  documentDetail$!: BehaviorSubject<DocumentDetail>;

  constructor(
    private customersService: CustomersService,
    private documentMakerService: DocumentMakerService,
  ) {}

  ngOnInit(): void {
    this.customers$ = this.customersService.customers$;
    this.documentDetail$ = this.documentMakerService.documentDetail$;
  }

  setCustomer(event: Customer): void {
    this.documentMakerService.setCustomer(event);
    this.documentMakerService.updateDeliveryAddress(event)
  }

  resetCustomer(): void {
    this.documentMakerService.resetCustomer();
  }


}
