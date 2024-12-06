import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Delivery } from './models/delivery.model';
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component';
import { DeliveryService } from './services/delivery.service';
import {  RouterLink } from '@angular/router';
import { ProfileService } from '../profile/services/profile.service';
import { UserProfile } from '../profile/models/userProfile.model';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [
    SearchBarComponent,
    BtnComponent,
    LoaderComponent,
    CommonModule,
    DeliveryListComponent,
    RouterLink,
  ],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
})
export class DeliveryComponent implements OnInit {
  deliveries$!: BehaviorSubject<Delivery[]>;
  userProfile$!: BehaviorSubject<UserProfile | null>;
  searchQuery = '';
  subscription: Subscription = new Subscription();
  isLoading$!: BehaviorSubject<boolean>;
  deliveriesWithInvoices! : {Delivery : Delivery, InvoiceID : string | null}[];

  constructor(
    private deliveryService: DeliveryService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.deliveries$ = this.deliveryService.deliveries$;
    this.userProfile$ = this.profileService.profile$;
    this.isLoading$ = this.deliveryService.isLoading$;
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }


}
