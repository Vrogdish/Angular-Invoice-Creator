import { Component, Input, OnInit } from '@angular/core';
import { Invoice, InvoiceForm } from '../../models/invoice.model';
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
  imports: [
    NgxExtendedPdfViewerModule,
    CommonModule,
    PdfViewerModule,
  ],
})
export class PdfPreviewComponent implements OnInit {
  @Input({required:true}) invoice!: InvoiceForm | Invoice;
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
    this.totalTva = this.totalHT * this.invoice.tva;
    this.totalTTC = this.totalHT + this.totalTva;
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
        { text: 'N° ' + this.invoice.num, margin: [0, 0, 0, 30] },
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
          text:
            'Date de facturation : ' + this.invoice.createdAt.toLocaleDateString(),
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
            ' €\nTVA ' +
            (this.invoice.tva * 100).toFixed(2) +
            '% : ' +
            this.totalTva.toFixed(2) +
            ' €\nTotal TTC : ' +
            this.totalTTC.toFixed(2) +
            ' €',
          alignment: 'right',
          margin: [0, 30, 0, 0],
        },
        {
          text: 'Merci de votre confiance',
        },
      ],
      footer: () => {
        return {
          columns: [
            {
              text:
                'Société : ' +
                this.invoice.vendor.company +
                '  -  ' +
                'Téléphone : ' +
                this.invoice.vendor.phone +
                '  -  ' +
                'Email : ' +
                this.invoice.vendor.email,
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
