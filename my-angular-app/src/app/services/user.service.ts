import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, where, doc, setDoc, updateDoc, getDoc, getDocs, query } from '@angular/fire/firestore';
import { Auth, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private profilePictureSubject = new BehaviorSubject<string | null>(null);
  public profilePicture$ = this.profilePictureSubject.asObservable();

  constructor(private firestore: Firestore, private auth: Auth) { }

  async getFirestoreUser(uid: string): Promise<any> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.warn('User not found in Firestore.');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving the user from Firestore:', error);
      return null;
    }
  }

  async addUser(user: User, additionalData: { phone: string; },) {
    try {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);

      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        phone: additionalData.phone,
        createdAt: new Date()
      });
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  }

  getFirestore() {
    return this.firestore;
  }

  async checkIfEmailOrPhoneExists(email: string, phone: string): Promise<boolean> {
    const userCollection = collection(this.firestore, 'users');

    const emailQuery = query(userCollection, where('email', '==', email))
    const phoneQuery = query(userCollection, where('phone', '==', phone))

    const emailSnapshot = await getDocs(emailQuery);
    const phoneSnapshot = await getDocs(phoneQuery)

    if (!emailSnapshot.empty || !phoneSnapshot.empty) {
      return true;
    }
    return false;
  }

  async updateProfilePicture(uid: string, imageUrl: string): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userDocRef);



      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          profilePicture: imageUrl
        });
        console.log('Profile picture has been updated!');
      } else {
        await setDoc(userDocRef, {
          profilePicture: imageUrl
        });
        console.log('Document has been created with profile picture!');
      }


      this.profilePictureSubject.next(imageUrl);
    } catch (error) {
      console.error('Error updating the picture:', error);
    }
  }

  async getProfilePicture(uid: string) {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data()?.['profilePicture'];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error loading the image from Firestore:", error);
      return null;
    }
  }
}
