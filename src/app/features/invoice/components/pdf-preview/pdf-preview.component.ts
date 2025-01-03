import { Component, Input, OnInit } from '@angular/core';
import { Invoice } from '../../models/invoice.model';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  templateUrl: './pdf-preview.component.html',
  styleUrl: './pdf-preview.component.scss',
  imports: [NgxExtendedPdfViewerModule, CommonModule, PdfViewerModule],
})
export class PdfPreviewComponent implements OnInit {
  @Input({ required: true }) invoice!: Invoice;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  pdfSrc!: any;
  totalHT!: number;
  totalTva!: number;
  totalTTC!: number;

  ngOnInit() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    this.totalHT = this.invoice.productsList.reduce(
      (acc, product) => acc + product.product.price * product.quantity,
      0
    );
    this.totalTTC = this.invoice.productsList.reduce(
      (acc, product) =>
        acc +
        product.product.price *
          product.quantity *
          (1 + product.product.tva / 100),
      0
    );
    this.totalTva = this.totalTTC - this.totalHT;
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
    if (!this.invoice) {
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
        { text: 'Facture', style: 'header' },
        {
          columns: [{ text: 'Vendeur : ' }, { text: 'Client: ' }],
          style: 'adressTitle',
        },

        {
          columns: [
            {
              text:
                this.invoice.vendor.company +
                '\n' +
                this.invoice.vendor.civility +
                ' ' +
                this.invoice.vendor.firstname +
                ' ' +
                this.invoice.vendor.lastname +
                '\n' +
                this.invoice.vendor.address +
                '\n' +
                this.invoice.vendor.postalCode +
                ' ' +
                this.invoice.vendor.city,
            },
            {
              text:
                this.invoice.customer?.company +
                '\n' +
                this.invoice.customer?.civility +
                ' ' +
                this.invoice.customer?.firstname +
                ' ' +
                this.invoice.customer?.lastname +
                '\n' +
                this.invoice.customer?.address +
                '\n' +
                this.invoice.customer?.postalCode +
                ' ' +
                this.invoice.customer?.city,
            },
          ],
          style: 'adress',
          alignment: 'justify',
        },
        {
          text: 'Numéro de facture : ' + this.invoice.num,
        },

        {
          text:
            'Date de facturation : ' +
            this.invoice.createdAt?.toLocaleDateString(),
          margin: [0, 0, 0, 30],
        },

        {
          table: {
            widths: [60, '*', 100, 60, 100],
            body: [
              [
                'Ref',
                'Article',
                'Prix unitaire HT',
                'Quantité',
                'Prix total HT',
              ],
              ...this.invoice.productsList.map((product) => [
                product.product.reference,
                product.product.name,
                product.product.price.toFixed(2) + ' €',
                product.quantity,
                (product.product.price * product.quantity).toFixed(2) + ' €',
              ]),
            ],
          },
          style: 'table',
        },

        {
          text:
            'Total HT : ' +
            this.totalHT.toFixed(2) +
            ' €\nMontant TVA : ' +
            this.totalTva.toFixed(2) +
            ' €\nTotal TTC : ' +
            this.totalTTC.toFixed(2) +
            ' €',
          alignment: 'right',
          margin: [0, 30, 0, 0],
        },
        {
          text: this.invoice.deliveries.length > 0 ? 'Liste des bons de livraison associés à cette facture :' : '',
          margin: [0, 0, 0, 5],
        },
        {
          text: this.invoice.deliveries.map((delivery) => delivery.num + '\n'),
        },
        {
          text: 'Merci de votre confiance.',
          margin: [0, 30, 0, 0],
        },
      ],
      footer: () => {
        return {
          columns: [
            {
              text:
                (this.invoice.vendor.company
                  ? 'Société : ' + this.invoice.vendor.company
                  : this.invoice.vendor.lastname.toUpperCase() +
                    ' ' +
                    this.invoice.vendor.firstname) +
                '  -  ' +
                (this.invoice.vendor.phone &&
                  'Téléphone : ' + this.invoice.vendor.phone + ' - ') +
                (this.invoice.vendor.email &&
                  'Email : ' + this.invoice.vendor.email),
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
