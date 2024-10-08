import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PdfPreviewComponent } from '../pdf-preview/pdf-preview.component';
import { CommonModule } from '@angular/common';
import { BtnComponent } from "../../../../shared/components/btn/btn.component";
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [PdfPreviewComponent, CommonModule,  BtnComponent, RouterLink, LoaderComponent],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss',
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  @ViewChild(PdfPreviewComponent) pdfPreviewComponent!: PdfPreviewComponent;

  invoice!: Invoice | null;
  id!: string | null;
  subscription: Subscription = new Subscription();
  isLoading = true;

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.params.subscribe( (params) => {
        this.id = params['id'];
        this.loadInvoice();
      })
    );
    this.subscription.add(
      this.invoiceService.isLoading$.subscribe((isLoading) => {
        this.isLoading = isLoading;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private async loadInvoice(): Promise<void> {
    if (this.id) {
      this.invoice = await this.invoiceService.getInvoiceById(this.id);
      
    }
  }

  openInvoicePdf(): void {
 this.pdfPreviewComponent.openPdf();
  }

  downloadInvoicePdf(): void {
    this.pdfPreviewComponent.downloadPdf();
  }


}
