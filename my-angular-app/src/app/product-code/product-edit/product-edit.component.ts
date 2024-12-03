import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product.model';
import { Auth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  @ViewChild('editForm') editForm!: NgForm

  product: Product | null = null;
  currentUserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private auth: Auth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      this.currentUserId = user ? user.uid : null;
    });
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProductDetails(productId);
    });
  }

  isProductOwner(product: Product): boolean {
    return product.ownerId === this.currentUserId;
  }

  loadProductDetails(productId: string) {
    this.productService.getProductById(productId).subscribe(
      (data: Product) => {
        if (data) {
          this.product = data;
        } else {
          console.error('No product found with the given ID.');
        }
      },
      (error) => {
        console.error('Error loading product details:', error);
      }
    );
  }

  updateProduct() {
    if (this.product && this.product.id) {

      if (!this.editForm.invalid) {
        this.productService.updateProduct(this.product).then(() => {
          console.log('Product updated successfully!');
          this.router.navigate(['/product', this.product?.id]);
        }).catch((error) => {
          console.error('Error updating product:', error);
        });
      } else {
        console.error('Form is invalid. Cannot update product.');
      }
    } else {
      if (!this.product) {
        console.error('Product is null, cannot update.');
      } else if (!this.product.id) {
        console.error('Product ID is undefined, cannot navigate.');
      }
    }
  }
}
