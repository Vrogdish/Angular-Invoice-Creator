import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { BtnComponent } from "../../../../shared/components/btn/btn.component";
import { InvoiceForm } from "../../models/invoice.model";
import { InvoiceService } from "../../services/invoice.service";
import { PdfPreviewComponent } from "../pdf-preview/pdf-preview.component";
import { SelectCustomerComponent } from "../select-customer/select-customer.component";
import { SelectProductsComponent } from "../select-products/select-products.component";


@Component({
  selector: 'app-invoice-creator',
  standalone: true,
  imports: [        CommonModule,
    BtnComponent,
    SelectCustomerComponent,
    SelectProductsComponent,
    RouterLink,
    PdfPreviewComponent],
  templateUrl: './invoice-creator.component.html',
  styleUrl: './invoice-creator.component.scss'
})
export class InvoiceCreatorComponent {
  @ViewChild(PdfPreviewComponent) pdfPreviewComponent!: PdfPreviewComponent;
  invoice$!: BehaviorSubject<InvoiceForm>;
  step: number = 1;

  constructor(private invoiceService: InvoiceService, private router:Router) {}

  ngOnInit(): void {
    this.invoice$ = this.invoiceService.invoice$;
  }

  setStep(step: number): void {
    this.step = step;
    console.log(this.invoice$.value)
  }

  downloadPdf(): void {
    this.pdfPreviewComponent.downloadPdf();
  }


  createInvoice(): void {
    this.invoiceService.createInvoice(this.invoice$.value);
    this.pdfPreviewComponent.openPdf();
    this.router.navigate(['/invoice'])
    
  }
}

