import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Order } from '../model/order.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private firestore: Firestore) { }

    async createOrder(order: Order): Promise<void> {
        const ordersCollection = collection(this.firestore, 'orders');
        await addDoc(ordersCollection, order);
    }
}
