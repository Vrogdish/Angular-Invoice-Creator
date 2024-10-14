import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, take } from 'rxjs';
import { DocumentDetail } from './models/document-detail.model';
import { DocumentMakerService } from './services/document-maker.service';
import { InvoiceService } from '../invoice/services/invoice.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DocumentTypeEnum } from './models/document-type.model';
import { SelectCustomerComponent } from './components/select-customer/select-customer.component';
import { DeliveryAddressFormComponent } from './components/delivery-address-form/delivery-address-form.component';
import { SelectProductsComponent } from './components/select-products/select-products.component';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { CompleteInvoiceComponent } from './components/complete-invoice/complete-invoice.component';
import { DeliveryService } from '../delivery/services/delivery.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { User } from '@angular/fire/auth';
import { SelectDeliveriesComponent } from './components/select-deliveries/select-deliveries.component';

@Component({
  selector: 'app-document-maker',
  standalone: true,
  imports: [
    CommonModule,
    SelectCustomerComponent,
    DeliveryAddressFormComponent,
    SelectProductsComponent,
    BtnComponent,
    RouterLink,
    CompleteInvoiceComponent,
    SelectDeliveriesComponent,
  ],
  templateUrl: './document-maker.component.html',
  styleUrl: './document-maker.component.scss',
})
export class DocumentMakerComponent implements OnInit {
  step$!: BehaviorSubject<number>;
  documentDetail$!: BehaviorSubject<DocumentDetail>;
  user$!: Observable<User | null>;
  createMode!: DocumentTypeEnum;
  invoiceType!: 'manual' | 'withDelivery' | null;

  constructor(
    private documentMakerService: DocumentMakerService,
    private invoiceService: InvoiceService,
    private deliveryService: DeliveryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((url) => {
      console.log(url);

      this.createMode = url[0].path as DocumentTypeEnum;
    });

    this.step$ = this.documentMakerService.step$;
    this.documentDetail$ = this.documentMakerService.documentDetail$;
    this.user$ = this.authService.authState$;
  }

  async createInvoice() {
    const invoiceNumber = await this.createInvoiceNumber();
    this.user$.pipe(take(1)).subscribe(async (user) => {
      if (user) {
        const id = await this.invoiceService.createInvoice(
          this.documentDetail$.value,
          user.uid,
          invoiceNumber
        );
        this.documentMakerService.resetDocumentDetail();
        this.documentMakerService.setStep(1);
        if (id) {
          this.router.navigate(['/invoice/detail/' + id]);
        }
      }
    });
  }

  async createDelivery() {
    const deliveryNumber = await this.createDeliveryNumber();
    this.user$.pipe(take(1)).subscribe(async (user) => {
      if (user) {
        const id = await this.deliveryService.createDelivery(
          this.documentDetail$.value,
          user.uid,
          deliveryNumber
        );
        this.documentMakerService.resetDocumentDetail();
        this.documentMakerService.setStep(1);
        if (id) {
          this.router.navigate(['/delivery/detail/' + id]);
        }
      }
    });
  }

  setStep(step: number) {
    this.documentMakerService.setStep(step);
  }

  undoSelectProducts() {
    this.setStep(1);
    this.invoiceType = null;
    this.documentMakerService.resetProducts();
  }

  setInvoiceType(type: 'manual' | 'withDelivery') {
    this.invoiceType = type;
  }

  private async createDeliveryNumber(): Promise<number> {
    const deliveries = await firstValueFrom(this.deliveryService.deliveries$);
    if (deliveries.length > 0) {
      deliveries.sort((a, b) => b.num - a.num);
      return deliveries[0].num + 1;
    } else {
      return 1;
    }
  }

  private async createInvoiceNumber(): Promise<number> {
    const invoices = await firstValueFrom(this.invoiceService.invoices$);
    if (invoices.length > 0) {
      invoices.sort((a, b) => b.num - a.num);
      return invoices[0].num + 1;
    } else {
      return 1;
    }
  }
}
