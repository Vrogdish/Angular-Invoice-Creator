import { CommonModule } from '@angular/common';
import { Component,  OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { InvoiceForm } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { PdfPreviewComponent } from '../pdf-preview/pdf-preview.component';
import { SelectCustomerComponent } from '../select-customer/select-customer.component';
import { SelectProductsComponent } from '../select-products/select-products.component';
import { PdfDeliveryPreviewComponent } from '../pdf-delivery-preview/pdf-delivery-preview.component';

@Component({
  selector: 'app-invoice-creator',
  standalone: true,
  imports: [
    CommonModule,
    BtnComponent,
    SelectCustomerComponent,
    SelectProductsComponent,
    RouterLink,
    PdfPreviewComponent,
    PdfDeliveryPreviewComponent,
  ],
  templateUrl: './invoice-creator.component.html',
  styleUrl: './invoice-creator.component.scss',
})
export class InvoiceCreatorComponent implements OnInit {
  invoice$!: BehaviorSubject<InvoiceForm>;
  step = 1;

  constructor(private invoiceService: InvoiceService, private router: Router) {}

  ngOnInit(): void {
    this.invoice$ = this.invoiceService.invoice$;
  }

  setStep(step: number): void {
    this.step = step;
  }

  createInvoice(): void {
    this.invoiceService.createInvoice(this.invoice$.value);
    this.router.navigate(['/invoice']);
  }
}
