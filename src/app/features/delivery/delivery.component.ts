import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Delivery } from './models/delivery.model';
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component';
import { DeliveryService } from './services/delivery.service';
import { Router, RouterLink } from '@angular/router';
import { DocumentMakerService } from '../document-maker/services/document-maker.service';
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
  isLoading = false;

  constructor(
    private deliveryService: DeliveryService,
    private documentMakerService: DocumentMakerService,
    private profileService: ProfileService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.deliveries$ = this.deliveryService.deliveries$;
    this.userProfile$ = this.profileService.profile$;
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }

  newDocument() {
    this.documentMakerService.resetDocumentDetail();
    this.documentMakerService.setStep(1);
    this.userProfile$.subscribe((profile) => {
      if (profile) this.documentMakerService.initDocumentDetail(profile);
    });
    this.router.navigate(['delivery/create']);
  }
}
