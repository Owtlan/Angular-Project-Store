import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../../model/product.model';
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
    likes: [],
    dislikes: [],
    colorImages: [],
    additionalImages: []
  };
  selectedFile: File | null = null;

  colors: { color: string; file: File | null }[] = [];
  colorFiles: { [color: string]: File | null } = {};


  constructor(private productService: ProductService, private auth: Auth, private router: Router) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addColorImage() {
    this.colors.push({ color: '', file: null });
  }

  removeColorImage(index: number) {
    this.colors.splice(index, 1);
  }

  onColorFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.colors[index].file = file;
    }
  }

  onColorImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.colors[index].file = file;
    }
  }

  addAdditionalImage() {
    this.product.additionalImages.push({ name: '', imageUrl: '' });
  }
  onAdditionalImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.product.additionalImages[index].imageUrl = reader.result as string;
        this.product.additionalImages[index].name = file.name;
      };
      reader.readAsDataURL(file);
    }
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
          if (color.file) {
            try {
              const colorImageUrl = await this.productService.uploadImageToCloudinary(color.file);
              colorImages.push({ color: color.color || 'Default', imageUrl: colorImageUrl });
            } catch (error) {
              console.error(`Failed to upload color image for color ${color.color}:`, error);
            }
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

