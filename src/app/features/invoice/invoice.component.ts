import { Component, OnInit} from '@angular/core';
import { InvoiceService } from './services/invoice.service';
import { BehaviorSubject } from 'rxjs';
import {  Invoice} from './models/invoice.model';
import { SearchBarComponent } from "../../shared/components/search-bar/search-bar.component";
import { BtnComponent } from "../../shared/components/btn/btn.component";
import { CommonModule } from '@angular/common';
import { InvoicesListComponent } from "./components/invoices-list/invoices-list.component";
import { AuthService } from '../../core/auth/services/auth.service';
import { RouterLink } from '@angular/router';

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
        RouterLink
    ]
})
export class InvoiceComponent implements OnInit{
  invoices$!: BehaviorSubject<Invoice[]>;
  searchQuery: string = '';

  constructor(private invoiceService: InvoiceService, private auth : AuthService) {}

  ngOnInit(): void {
    this.auth.authState$.subscribe((user) => {
      if (user) {
        this.invoiceService.loadInvoices(user.uid);
      }
    })
    this.invoices$ = this.invoiceService.invoices$;
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }
}
