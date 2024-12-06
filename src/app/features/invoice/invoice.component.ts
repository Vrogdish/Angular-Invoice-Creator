import { Component, OnInit } from '@angular/core';
import { InvoiceService } from './services/invoice.service';
import { BehaviorSubject } from 'rxjs';
import { Invoice } from './models/invoice.model';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { CommonModule } from '@angular/common';
import { InvoicesListComponent } from './components/invoices-list/invoices-list.component';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ProfileService } from '../profile/services/profile.service';
import { UserProfile } from '../profile/models/userProfile.model';

@Component({
  selector: 'app-invoice',
  standalone: true,
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
  imports: [
    SearchBarComponent,
    BtnComponent,
    CommonModule,
    InvoicesListComponent,
    RouterLink,
    LoaderComponent,
  ],
})
export class InvoiceComponent implements OnInit {
  invoices$!: BehaviorSubject<Invoice[]>;
  searchQuery = '';
  isLoading$!: BehaviorSubject<boolean>;
  userProfile$!: BehaviorSubject<UserProfile | null>;

  constructor(
    private invoiceService: InvoiceService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.invoiceService.isLoading$;
    this.invoices$ = this.invoiceService.invoices$;
    this.userProfile$ = this.profileService.profile$;
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }
}
