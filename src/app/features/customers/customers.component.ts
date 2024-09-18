import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { CustomersService } from './services/customers.service';
import { BehaviorSubject } from 'rxjs';
import { Customer } from './models/customer.model';
import { CommonModule } from '@angular/common';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

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
    LoaderComponent
],
})
export class CustomersComponent implements OnInit{
  customers$: BehaviorSubject<Customer[] | null> = new BehaviorSubject<
    Customer[] | null
  >(null);
  searchQuery= '';
  isLoading$!: BehaviorSubject<boolean>;

  constructor(
    private customersService: CustomersService,
  ) {}

  ngOnInit(): void {
    this.customers$ = this.customersService.customers$;
    this.isLoading$ = this.customersService.isLoading$;
  }
 
  onSearch($event: string) {
    this.searchQuery = $event;
  }
}
