import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Delivery } from '../models/delivery.model';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { DocumentDetail } from '../../document-maker/models/document-detail.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  deliveries$: BehaviorSubject<Delivery[]> = new BehaviorSubject<Delivery[]>(
    []
  );
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private firestore: Firestore) {}



  async loadDeliveries(uid: string) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'deliveries');
      const q = query(
        collectionRef,
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const deliveries: Delivery[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Delivery;
        if (data.createdAt instanceof Timestamp) {
          data.createdAt = data.createdAt.toDate();
        }
        deliveries.push({ ...data, id: doc.id });
      });
      this.deliveries$.next(deliveries);
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de charger les bons de livraison. Veuillez réessayer.'
      );
    } finally {
      this.isLoading$.next(false);
    }
  }

  async getDeliveryById(id: string) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'deliveries');
      const docRef = doc(collectionRef, id);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data() as Delivery;

      if (data.createdAt instanceof Timestamp) {
        data.createdAt = data.createdAt.toDate();
      }

      return data;
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de charger les bons de livraison. Veuillez réessayer.'
      );
      return null;
    } finally {
      this.isLoading$.next(false);
    }
  }

  async createDelivery(
    documentDetail: DocumentDetail,
    uid: string,
    deliveryNumber: number
  ) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    const delivery: Delivery = {
      vendor: documentDetail.vendor,
      customer: documentDetail.customer,
      deliveryAddress: documentDetail.deliveryAddress,
      productsList: documentDetail.productsList,
      uid: uid,
      num: deliveryNumber,
    };
    try {
      const collectionRef = collection(this.firestore, 'deliveries');
      const docRef = await addDoc(collectionRef, {
        ...delivery,
        createdAt: Timestamp.fromDate(new Date()),
        
      });
      await this.loadDeliveries(uid);
      return docRef.id;
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de créer le bon de livraison. Veuillez réessayer.'
      );
      return null;
    } finally {
      this.isLoading$.next(false);
    }
  }

  async deleteDelivery(id: string, uid: string) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'deliveries');
      await deleteDoc(doc(collectionRef, id));
      await this.loadDeliveries(uid);
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de supprimer le bon de livraison. Veuillez réessayer.'
      );
    } finally {
      this.isLoading$.next(false);
    }
  }
}
