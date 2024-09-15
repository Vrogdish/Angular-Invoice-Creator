import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DocumentDetail } from './models/document-detail.model';
import { DocumentMakerService } from './services/document-maker.service';
import { InvoiceService } from '../invoice/services/invoice.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { createModeEnum } from './models/create-mode.model';
import { SelectCustomerComponent } from './components/select-customer/select-customer.component';
import { DeliveryAddressFormComponent } from './components/delivery-address-form/delivery-address-form.component';
import { SelectProductsComponent } from "./components/select-products/select-products.component";
import { BtnComponent } from "../../shared/components/btn/btn.component";
import { CompleteInvoiceComponent } from "./components/complete-invoice/complete-invoice.component";


@Component({
  selector: 'app-document-maker',
  standalone: true,
  imports: [CommonModule, SelectCustomerComponent, DeliveryAddressFormComponent, SelectProductsComponent, BtnComponent, RouterLink, CompleteInvoiceComponent],
  templateUrl: './document-maker.component.html',
  styleUrl: './document-maker.component.scss',
})
export class DocumentMakerComponent implements OnInit {
  step$!: BehaviorSubject<number>;
  documentDetail$!: BehaviorSubject<DocumentDetail>;
  createMode!: createModeEnum;

  constructor(
    private documentMakerService: DocumentMakerService,
    private invoiceService: InvoiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    
  ) {}

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((url) => {
      console.log(url);
      
      this.createMode = url[0].path as createModeEnum;
    });
    
    this.step$ = this.documentMakerService.step$;
    this.documentDetail$ = this.documentMakerService.documentDetail$;
  }

  create() {
    //  this.invoiceService.createInvoice(this.invoice$.value);
    console.log(this.documentDetail$.value);
    
    this.documentMakerService.resetDocumentDetail();
    this.documentMakerService.setStep(1);
    // this.router.navigate(['/invoice']);
  }

  setStep(step: number) {
    this.documentMakerService.setStep(step);
  }
}
