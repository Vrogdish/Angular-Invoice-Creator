import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, startWith } from 'rxjs';
import { Customer } from '../../../features/customers/models/customer.model';
import { CustomersService } from '../../../features/customers/services/customers.service';
import { CivilityEnum } from '../../models/civility.model';
import { FormGroup } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-customer',
  standalone: true,
  imports: [NgSelectModule, CommonModule],
  templateUrl: './select-customer.component.html',
  styleUrl: './select-customer.component.scss',
})
export class SelectCustomerComponent implements OnInit {
  @Input() form!: FormGroup;
  @Output() customerEmitter: EventEmitter<Customer> =
    new EventEmitter<Customer>();
  customers$!: BehaviorSubject<Customer[] | null>;
  customerSelected: Customer | null = null;

  constructor(private cutomerService: CustomersService) {}

  ngOnInit(): void {
    this.customers$ = this.cutomerService.customers$;
    this.form
      .get('customer')
      ?.valueChanges.pipe(startWith(this.form.get('customer')?.value))
      .subscribe((customer: Customer) => {
        this.customerSelected = customer;
      });
  }

  setCustomer(event: Customer): void {
    this.customerEmitter.emit(event);
  }

  resetCustomer(): void {
    this.customerEmitter.emit({
      id: '',
      uid: '',
      civility: CivilityEnum.male,
      firstname: '',
      lastname: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      postalCode: '',
      city: '',
      country: '',
    });
  }
}
