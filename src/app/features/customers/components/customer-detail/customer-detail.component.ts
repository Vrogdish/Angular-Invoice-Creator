import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { CustomersService } from '../../services/customers.service';
import { Subscription } from 'rxjs';
import { CustomerFormComponent } from "../customer-form/customer-form.component";

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CustomerFormComponent],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss',
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  customer!: Customer | null;
  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomersService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        this.customer = this.customerService.getCustomerById(params['id']);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
