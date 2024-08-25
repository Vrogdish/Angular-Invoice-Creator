import { CommonModule } from '@angular/common';
import { Component,  OnInit } from '@angular/core';
import {  Router, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { InvoiceForm } from '../../models/invoice.model';
import { PdfPreviewComponent } from '../pdf-preview/pdf-preview.component';
import { SelectCustomerComponent } from '../select-customer/select-customer.component';
import { SelectProductsComponent } from '../select-products/select-products.component';
import { PdfDeliveryPreviewComponent } from '../pdf-delivery-preview/pdf-delivery-preview.component';
import { InvoiceCreatorService } from '../../services/invoice-creator.service';
import { InvoiceService } from '../../services/invoice.service';

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
  step$!: BehaviorSubject<number>;
  invoice$!: BehaviorSubject<InvoiceForm>;

  constructor(private invoiceCreatorService: InvoiceCreatorService, private invoiceService : InvoiceService, private router : Router) {}

  ngOnInit(): void {
    this.step$ = this.invoiceCreatorService.step$;
    this.invoice$ = this.invoiceCreatorService.invoice$;
  }

  previous(): void {
    this.invoiceCreatorService.setStep(2);
  }

  async create()  {
   this.invoiceService.createInvoice(this.invoice$.value);
   this.invoiceCreatorService.resetInvoice();
   this.invoiceCreatorService.setStep(1);
  

   this.router.navigate(['/invoice']);
  }

}
