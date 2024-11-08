import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, setDoc ,updateDoc,getDoc} from '@angular/fire/firestore';
import { Auth, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore, private auth: Auth) { }

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
  async updateProfilePicture(uid: string, imageUrl: string): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userDocRef);



      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          profilePicture: imageUrl
        });
        console.log('Профилната снимка беше обновена!');
      } else {
        await setDoc(userDocRef, {
          profilePicture: imageUrl
        });
        console.log('Документът беше създаден с профилна снимка!');
      }
    } catch (error) {
      console.error('Грешка при обновяване на снимка:', error);
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
      console.error("Грешка при зареждане на снимката от Firestore:", error);
      return null;
    }
  }


}
