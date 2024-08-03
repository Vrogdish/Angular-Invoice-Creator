import { Injectable, inject } from '@angular/core';
import { Product, ProductForm } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';
import {
  Firestore,
  addDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
} from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products$ = new BehaviorSubject<Product[] | null>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);
  errorMessages$ = new BehaviorSubject<string | null>(null);

  firestore = inject(Firestore);

  async loadProducts(uid: string) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      const collectionRef = collection(this.firestore, 'products');
      const q = query(collectionRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ ...doc.data(), id: doc.id } as Product);
      });
      this.products$.next(products);
    } catch (error) {
      console.error(error);
      this.errorMessages$.next("Couldn't load products. Please try again.");
    }
    this.isLoading$.next(false);
  }

  async addProduct(uid: string, product: FormGroup<ProductForm>) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      const collectionRef = collection(this.firestore, 'products');
      await addDoc(collectionRef, {
        ...product.value,
        uid,
      });
      this.loadProducts(uid);
    } catch (error) {
      console.error(error);
      this.errorMessages$.next("Couldn't add product. Please try again.");
    }

    this.isLoading$.next(false);
  }

  updateProduct(id: string, product: ProductForm) {
    console.log('updateProduct', id, product);
    
  }

  async deleteProduct(id: string , uid: string) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      await deleteDoc(doc(this.firestore, 'products', id));
      this.loadProducts(uid);
    } catch (error) {
      console.error(error);
      this.errorMessages$.next("Couldn't delete product. Please try again.");
    }
  }
}
