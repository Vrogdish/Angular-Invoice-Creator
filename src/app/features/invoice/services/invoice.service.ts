import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
} from '@angular/fire/firestore';
import {  Invoice } from '../models/invoice.model';
import { DocumentDetail } from '../../document-maker/models/document-detail.model';


@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  invoices$: BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private firestore: Firestore) {}

  


  getTotalHT(invoice : Invoice): number {
    const total = invoice.productsList.reduce(
      (acc, product) => acc + product.product.price * product.quantity,
      0
    );
    return total;
  }



  async loadInvoices(uid: string) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'invoices');
      const q = query(collectionRef, where('uid', '==', uid), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const invoices: Invoice[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Invoice;
        if (data.createdAt instanceof Timestamp) {
          data.createdAt = data.createdAt.toDate();
        }
        invoices.push({ ...data, id: doc.id });
      });
      this.invoices$.next(invoices);
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de charger les factures. Veuillez réessayer.'
      );
    } finally {
      this.isLoading$.next(false);
      
    }
  }

  async getInvoiceById(id: string) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'invoices');
      const docRef = doc(collectionRef, id);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data() as Invoice;

      if (data.createdAt instanceof Timestamp) {
        data.createdAt = data.createdAt.toDate();
      }

      return data;
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de charger la facture. Veuillez réessayer.'
      );
      return null;
    } finally {
      this.isLoading$.next(false);
    }
  }

  async createInvoice(documentDetail : DocumentDetail, uid : string, invoiceNumber : number) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'invoices');
      await addDoc(collectionRef, {
        ...documentDetail,
        createdAt: Timestamp.fromDate(new Date()),
        uid : uid,
        num : invoiceNumber
      });
      await this.loadInvoices(uid);
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de créer la facture. Veuillez réessayer.'
      );
    } finally {
      this.isLoading$.next(false);
    
    }
  }

  async deleteInvoice(id: string, uid: string) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'invoices');
      await deleteDoc(doc(collectionRef, id));
      await this.loadInvoices(uid);
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de supprimer la facture. Veuillez réessayer.'
      );
    } finally {
      this.isLoading$.next(false);
    }
  }
}
