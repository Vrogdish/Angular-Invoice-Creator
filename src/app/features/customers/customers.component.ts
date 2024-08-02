import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { CustomersService } from './services/customers.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Customer } from './models/customer.model';
import { AuthService } from '../../core/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import { RouterLink } from '@angular/router';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-customers',
  standalone: true,
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  imports: [
    SearchBarComponent,
    BtnComponent,
    CommonModule,
    CustomersListComponent,
    RouterLink,
  ],
})
export class CustomersComponent implements OnInit, OnDestroy {
  customers$: BehaviorSubject<Customer[] | null> = new BehaviorSubject<
    Customer[] | null
  >(null);
  searchQuery: string = '';
  subscription: Subscription = new Subscription();

  constructor(
    private customersService: CustomersService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.auth.authState$.subscribe((user) => {
        if (user) {
          this.customersService.loadCustomers(user.uid!);
        }
      })
    );
    this.customers$ = this.customersService.customers$;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearch($event: string) {
    this.searchQuery = $event;
  }
}
