import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../model/product.model';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent {
  product: Product = {
    id: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    ownerId: '',
    colorImages: [],
  };
  selectedFile: File | null = null;

  colors = ['green', 'black', 'red', 'blue']
  colorFiles: { [color: string]: File | null } = {};


  constructor(private productService: ProductService, private auth: Auth, private router: Router) { }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onColorImageSelected(event: any, color: string) {
    this.colorFiles[color] = event.target.files[0]
  }

  async addProduct() {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      console.error('No user is logged in');
      return;
    }

    if (this.selectedFile) {
      try {
        this.product.ownerId = currentUser.uid;

        const imageUrl = await this.productService.uploadImageToCloudinary(this.selectedFile);
        this.product.imageUrl = imageUrl;

        const colorImages: { color: string; imageUrl: string }[] = [];
        for (const color of this.colors) {
          if (this.colorFiles[color]) {
            const colorImageUrl = await this.productService.uploadImageToCloudinary(this.colorFiles[color]!);
            colorImages.push({ color, imageUrl: colorImageUrl });
          }
        }
        this.product.colorImages = colorImages;

        await this.productService.addProduct(this.product);
        console.log('Product added successfully!');
        this.router.navigate(['/'])
      } catch (error) {
        console.error('Error adding product:', error);
      }
    } else {
      console.error('Please select an image file.');
    }
  }
}

