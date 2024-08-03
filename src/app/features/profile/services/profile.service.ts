import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile, UserProfileForm } from '../models/userProfile.model';
import {
  Firestore,
  collection,
  getDocs,
  updateDoc,
  query,
  where,
  doc,
  addDoc,
  Timestamp
} from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  profile$ = new BehaviorSubject<UserProfile | null>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);
  errorMessages$ = new BehaviorSubject<string | null>(null);

  firestore = inject(Firestore);

  async loadProfile(uid: string) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      const collectionRef = collection(this.firestore, 'userProfile');
      const q = query(collectionRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data() as UserProfile;
        const id = doc.id;
        if (data.createdAt instanceof Timestamp) {
          data.createdAt = data.createdAt.toDate();
        }
        if (data.updatedAt instanceof Timestamp) {
          data.updatedAt = data.updatedAt.toDate();
        }
        this.profile$.next({ ...data, id } );
      });
    } catch (error) {
      console.error(error);
      this.errorMessages$.next("Impossible de charger le profil. Veuillez réessayer.");
    }
    this.isLoading$.next(false);
  }

  async updateProfile(id: string, profileForm: FormGroup<UserProfileForm>) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      const collectionRef = doc(this.firestore, 'userProfile', id);
      await updateDoc(collectionRef, {
        firstname: profileForm.get('firstname')?.value,
        lastname: profileForm.get('lastname')?.value,
        civility: profileForm.get('civility')?.value,
        company: profileForm.get('company')?.value,
        address: profileForm.get('address')?.value,
        city: profileForm.get('city')?.value,
        postalCode: profileForm.get('postalCode')?.value,
        phoneNumber: profileForm.get('phoneNumber')?.value,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error(error);
      this.errorMessages$.next("Impossible de mettre à jour le profil. Veuillez réessayer.");
    }
    this.isLoading$.next(false);
  }

  async createProfile(
    uid: string,
    firstname: string,
    lastname: string,
    email: string
  ) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      await addDoc(collection(this.firestore, 'userProfile'), {
        uid: uid,
        firstname: firstname,
        lastname: lastname,
        email: email,
        createdAt: Timestamp.fromDate(new Date()),
      });
      await this.loadProfile(uid);
    } catch (error) {
      console.error(error);
      this.errorMessages$.next("Impossible de créer le profil. Veuillez réessayer.");
    }
    this.isLoading$.next(false);
  }
}
