import { Component, OnInit } from '@angular/core';
import { InvoiceService } from './services/invoice.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { SelectCustomerComponent } from './components/select-customer/select-customer.component';
import { Invoice } from './models/invoice.model';
import { SelectProductsComponent } from './components/select-products/select-products.component';

@Component({
  selector: 'app-invoice',
  standalone: true,
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
  imports: [
    CommonModule,
    BtnComponent,
    SelectCustomerComponent,
    SelectProductsComponent,
  ],
})
export class InvoiceComponent implements OnInit {
  invoice$!: BehaviorSubject<Invoice>;
  step: number = 1;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoice$ = this.invoiceService.invoice$;
  }

  setStep(step: number): void {
    this.step = step;
  }
}
