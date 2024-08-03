import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PdfPreviewComponent } from '../pdf-preview/pdf-preview.component';
import { CommonModule } from '@angular/common';
import { PdfDeliveryPreviewComponent } from "../pdf-delivery-preview/pdf-delivery-preview.component";
import { BtnComponent } from "../../../../shared/components/btn/btn.component";
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [PdfPreviewComponent, CommonModule, PdfDeliveryPreviewComponent, BtnComponent, RouterLink, LoaderComponent],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss',
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  @ViewChild(PdfPreviewComponent) pdfPreviewComponent!: PdfPreviewComponent;
  @ViewChild(PdfDeliveryPreviewComponent) PdfDeliveryPreviewComponent!: PdfDeliveryPreviewComponent;

  invoice!: Invoice | null;
  id!: string | null;
  subscription: Subscription = new Subscription();
  isLoading: boolean = true;

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
      console.log(this.invoice);
      
    }
  }

  openInvoicePdf(): void {
 this.pdfPreviewComponent.openPdf();
  }

  openDeliveryPdf(): void {
    this.PdfDeliveryPreviewComponent.openPdf();
  }

}
