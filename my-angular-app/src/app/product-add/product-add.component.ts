import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../model/product.model';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent {
  product: Product = {
    name: '',
    description: '',
    price: 0,
    imageUrl: ''
  };
  selectedFile: File | null = null; 

  constructor(private productService: ProductService) { }

 
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];  
  }


  addProduct() {
    if (this.selectedFile) {
      this.productService.addProductWithImage(this.product, this.selectedFile)
        .then(() => {
          console.log('Product added successfully!');
          this.product = { name: '', description: '', price: 0, imageUrl: '' };
          this.selectedFile = null; 
        })
        .catch(error => {
          console.error('Error adding product:', error);
        });
    } else {
      console.error('Please select an image file.');
    }
  }
}

