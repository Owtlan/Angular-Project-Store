import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product.model';
import { Auth, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  currentUserId: string | null = null;
 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    authState(this.auth).subscribe(user => {
      this.currentUserId = user ? user.uid : null; 
    });

    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProductDetails(productId);
    });
  }

  loadProductDetails(productId: string) {
    this.productService.getProductById(productId).subscribe(
      (data: Product) => {
        this.product = data;
      },
      (error) => {
        console.error('Error loading product details:', error);
      }
    );
  }

  isProductOwner(product: Product): boolean {
    return product.ownerId === this.currentUserId; // Проверка дали текущият потребител е собственик
  }

  editProduct(product: Product) {
    this.router.navigate(['/product/edit', product.id]); // Пренасочва към новата страница за редактиране
  }

  deleteProduct(product: Product) {
    this.productService.deleteProduct(product.id).then(() => {
      console.log('Продуктът е изтрит');
      // Можеш да добавиш навигация обратно към списъка с продукти
    }).catch((error) => {
      console.error('Грешка при изтриване на продукта:', error);
    });
  }
}
