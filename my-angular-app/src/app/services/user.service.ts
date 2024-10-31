import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore, private auth: Auth) { }

  async addUser(user: User) {
    try {
      const usersCollection = collection(this.firestore, 'users');
      await addDoc(usersCollection, {
        uid: user.uid,
        email: user.email,
        createdAt: new Date()
      })
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  }

}
