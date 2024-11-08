import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Firestore, collection, doc, setDoc, collectionData, deleteDoc, docData } from '@angular/fire/firestore';
import { Product } from "../model/product.model";
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private productsCollection;

    constructor(private firestore: Firestore, private http: HttpClient, private auth: Auth) {
        this.productsCollection = collection(this.firestore, 'products');
    }


    async uploadImageToCloudinary(file: File): Promise<string> {
        const url = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'vpseafg5');

        const response = await this.http.post<any>(url, formData).toPromise();
        return response.secure_url;
    }

    async addProductWithImage(product: Product, mainImage: File, colorFiles: { [color: string]: File }): Promise<void> {
        const mainImageUrl = await this.uploadImageToCloudinary(mainImage);

        const colorImagesUrls: { [color: string]: string } = {};
        for (const color in colorFiles) {
            if (colorFiles[color]) {
                const colorImageUrl = await this.uploadImageToCloudinary(colorFiles[color]);
                colorImagesUrls[color] = colorImageUrl;
            }
        }

        const currentUser = this.auth.currentUser;
        const productWithImages = {
            ...product,
            imageUrl: mainImageUrl,
            colorImages: colorImagesUrls, 
            ownerId: currentUser ? currentUser.uid : ''
        };

        const newDocRef = doc(this.productsCollection);
        return setDoc(newDocRef, { ...productWithImages, id: newDocRef.id });
    }

    async updateProduct(product: Product): Promise<void> {
        const productDocRef = doc(this.productsCollection, product.id);
        await setDoc(productDocRef, product);
    }

    async deleteProduct(productId: string | undefined): Promise<void> {
        if (!productId) throw new Error("Product ID is undefined");
        const productDocRef = doc(this.productsCollection, productId);
        await deleteDoc(productDocRef);
    }

    addProduct(product: Product): Promise<void> {
        const newDocRef = doc(this.productsCollection);
        return setDoc(newDocRef, { ...product, id: newDocRef.id });
    }

    getProducts(): Observable<Product[]> {
        return collectionData(this.productsCollection, { idField: 'id' }) as Observable<Product[]>;
    }

    getProductById(productId: string): Observable<Product> {
        const productDocRef = doc(this.productsCollection, productId);
        return docData(productDocRef, { idField: 'id' }) as Observable<Product>;
    }
}


