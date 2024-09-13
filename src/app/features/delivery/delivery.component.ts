import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from "../../shared/components/search-bar/search-bar.component";
import { BtnComponent } from "../../shared/components/btn/btn.component";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Delivery } from './models/delivery.model';
import { DeliveryListComponent } from "./components/delivery-list/delivery-list.component";
import { DeliveryService } from './services/delivery.service';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [SearchBarComponent, BtnComponent, LoaderComponent, CommonModule, DeliveryListComponent],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss'
})
export class DeliveryComponent implements OnInit {
  deliveries$!: BehaviorSubject<Delivery[]>;
  searchQuery = '';
  subscription : Subscription = new Subscription();
  isLoading = false;

  constructor(private deliveryService : DeliveryService) {}

  ngOnInit(): void {
    this.deliveries$ = this.deliveryService.deliveries$;

  }
  
  onSearch(query: string) {
    this.searchQuery = query;
  }
}
