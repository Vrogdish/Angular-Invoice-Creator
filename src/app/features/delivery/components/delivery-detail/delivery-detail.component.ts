import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PdfDeliveryPreviewComponent } from '../pdf-delivery-preview/pdf-delivery-preview.component';
import { Delivery } from '../../models/delivery.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DeliveryService } from '../../services/delivery.service';
import { CommonModule } from '@angular/common';
import { BtnComponent } from "../../../../shared/components/btn/btn.component";
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";

@Component({
  selector: 'app-delivery-detail',
  standalone: true,
  imports: [CommonModule, BtnComponent, PdfDeliveryPreviewComponent, LoaderComponent,RouterLink],
  templateUrl: './delivery-detail.component.html',
  styleUrl: './delivery-detail.component.scss'
})
export class DeliveryDetailComponent implements OnInit, OnDestroy {
 
  @ViewChild(PdfDeliveryPreviewComponent) PdfDeliveryPreviewComponent!: PdfDeliveryPreviewComponent;

  delivery!: Delivery | null;
  id!: string | null;
  subscription: Subscription = new Subscription();
  isLoading = true;

  constructor(
    private deliveryService: DeliveryService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.params.subscribe(async (params) => {
        this.id = params['id'];
        if (this.id) {
          this.delivery = await this.deliveryService.getDeliveryById(this.id);
          console.log(this.delivery);
          
        }
      })
    );
    this.subscription.add(
      this.deliveryService.isLoading$.subscribe((isLoading) => {
        this.isLoading = isLoading;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDeliveryPdf(): void {
    this.PdfDeliveryPreviewComponent.openPdf();
  }

  downloadDeliveryPdf(): void {
    this.PdfDeliveryPreviewComponent.downloadPdf();
  }



}
