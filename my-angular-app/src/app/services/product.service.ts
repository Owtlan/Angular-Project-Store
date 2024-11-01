import { Injectable } from "@angular/core";
import { Firestore, collection, addDoc, doc, setDoc, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Product } from "../model/product.model";
import { Observable } from 'rxjs'



@Injectable({
    providedIn: 'root'
})


export class ProductService {
    private productsCollection;

    constructor(private firestore: Firestore, private storage: Storage) {
        this.productsCollection = collection(this.firestore, 'products');
    }

    addProduct(product: Product): Promise<void> {
        const newDocRef = doc(this.productsCollection);
        return setDoc(newDocRef, { ...product, id: newDocRef.id });
    }

    getProducts(): Observable<Product[]> {
        return collectionData(this.productsCollection, { idField: 'id' }) as Observable<Product[]>;
    }

    async uploadImage(file: File): Promise<string> {
        const filePath = `product-image/${file.name}`;
        const storageRef = ref(this.storage, filePath);

        await uploadBytes(storageRef, file);

        return await getDownloadURL(storageRef);
    }

    async addProductWithImage(product: Product, file: File): Promise<void> {
        const imageUrl = await this.uploadImage(file); 
        const productWithImage = { ...product, imageUrl };
    
        const newDocRef = doc(this.productsCollection); 
        return setDoc(newDocRef, { ...productWithImage, id: newDocRef.id });
    }
}