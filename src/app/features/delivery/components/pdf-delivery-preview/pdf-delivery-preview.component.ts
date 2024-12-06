import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Delivery } from '../../models/delivery.model';

@Component({
  selector: 'app-pdf-delivery-preview',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, CommonModule, PdfViewerModule],
  templateUrl: './pdf-delivery-preview.component.html',
  styleUrl: './pdf-delivery-preview.component.scss',
})
export class PdfDeliveryPreviewComponent implements OnInit {
  @Input({ required: true }) delivery!: Delivery;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  pdfSrc!: any;

  ngOnInit() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.updatePdfSrc();
  }

  downloadPdf() {
    const documentDefinition = this.getDocDefinition();
    pdfMake.createPdf(documentDefinition).download();
  }

  openPdf() {
    const documentDefinition = this.getDocDefinition();
    pdfMake.createPdf(documentDefinition).open();
  }

  updatePdfSrc() {
    if (!this.delivery) {
      return;
    }
    const documentDefinition = this.getDocDefinition();
    pdfMake.createPdf(documentDefinition).getBuffer((buffer) => {
      const blob = new Blob([buffer], { type: 'application/pdf' });
      this.pdfSrc = URL.createObjectURL(blob);
    });
  }

  getDocDefinition(): TDocumentDefinitions {
    return {
      content: [
        { text: 'Bon de livraison', style: 'header' },
        {
          columns: [{ text: 'Vendeur : ' }, { text: 'Client: ' }],
          style: 'adressTitle',
        },

        {
          columns: [
            {
              text:
                this.delivery.vendor.company +
                '\n' +
                this.delivery.vendor.civility +
                ' ' +
                this.delivery.vendor.firstname +
                ' ' +
                this.delivery.vendor.lastname +
                '\n' +
                this.delivery.vendor.address +
                '\n' +
                this.delivery.vendor.postalCode +
                ' ' +
                this.delivery.vendor.city,
            },
            {
              text:
                this.delivery.customer.company +
                '\n' +
                this.delivery.customer.civility +
                ' ' +
                this.delivery.customer.firstname +
                ' ' +
                this.delivery.customer.lastname +
                '\n' +
                this.delivery.deliveryAddress.address +
                '\n' +
                this.delivery.deliveryAddress.postalCode +
                ' ' +
                this.delivery.deliveryAddress.city,
            },
          ],
          style: 'adress',
          alignment: 'justify',
        },
        {
          text: 'Numero de bon : ' + this.delivery.num,
        },

        {
          text:
            'Date de création du bon : ' +
            this.delivery.createdAt?.toLocaleDateString(),
          margin: [0, 0, 0, 30],
        },

        {
          table: {
            widths: [60, '*', 100, 60, 100],
            body: [
              ['Ref', 'Article', 'Quantité'],
              ...this.delivery.productsList.map((product) => [
                product.product.reference,
                product.product.name,

                product.quantity,
              ]),
            ],
          },
          style: 'table',
        },

        {
          text:
            'Adresse de livraison : ' +
            '\n' +
            '\n' +
            this.delivery.deliveryAddress.address +
            '\n' +
            this.delivery.deliveryAddress.postalCode +
            ' ' +
            this.delivery.deliveryAddress.city,
          margin: [0, 30],
        },
      ],
      footer: () => {
        return {
          columns: [
            {
              text:
                (this.delivery.vendor.company
                  ? 'Société : ' + this.delivery.vendor.company
                  : this.delivery.vendor.lastname.toUpperCase() +
                    ' ' +
                    this.delivery.vendor.firstname) +
                '  -  ' +
                (this.delivery.vendor.phone &&
                  'Téléphone : ' + this.delivery.vendor.phone + ' - ') +
                (this.delivery.vendor.email &&
                  'Email : ' + this.delivery.vendor.email),
              style: 'footer',
            },
          ],
          margin: [40, 0],
        };
      },

      styles: {
        header: {
          fontSize: 40,
          bold: true,
          margin: [0, 0, 0, 60],
        },
        adress: {
          margin: [0, 0, 0, 60],
        },
        adressTitle: {
          margin: [0, 0, 0, 10],
          fontSize: 16,
          bold: true,
        },

        footer: {
          fontSize: 10,
          margin: [10, 0, 10, 0],
        },
      },
    };
  }
}
