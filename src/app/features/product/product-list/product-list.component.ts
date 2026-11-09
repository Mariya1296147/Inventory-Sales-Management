import { CommonModule } from '@angular/common'; 
import { Product } from '../../../models/product'; 
import { ProductService } from '../../../service/product.service'; 
import { RouterLink } from '@angular/router'; 
import { Component, OnInit } from '@angular/core'; 
 
@Component({ 
  selector: 'app-product-list', 
  standalone: true, 
  imports: [ 
    CommonModule, 
    RouterLink 
  ], 
  templateUrl: './product-list.component.html', 
  styleUrl: './product-list.component.scss' 
}) 
export class ProductListComponent implements OnInit { 
 
  products: Product[] = []; 
 
  loading = false; 
 
  errorMessage = ''; 
  selectedImageUrl: string | undefined; 
 
  constructor( 
    private productService: ProductService 
  ) {} 
 
  ngOnInit(): void { 
 
    this.loadProducts(); 
  } 
 
  loadProducts(): void { 
    this.loading = true; 
    this.errorMessage = ''; 
 
    this.productService 
      .getAll() 
      .subscribe({ 
        next: (data: Product[]) => { 
 
          this.products = data; 
 
          this.loading = false; 
 
        }, 
 
        error: (error: any) => { 
 
          console.error( 
            'Product API Error:', 
            error 
          ); 
 
          this.errorMessage = 
            'Unable to load products. Please try again.'; 
 
          this.loading = false; 
 
        } 
 
      }); 
 
  } 
 
  getProductImages(product: Product): string[] { 
 
    const urls = product.imageUrls?.filter(url => !!url?.trim()) 
      ?? (product.imageUrl ? [product.imageUrl] : []); 
 
    return urls.map(url => 
      url.startsWith('http') ? url : `http://localhost:9090${url}` 
    ); 
 
  } 
 
  openImageViewer(url: string, name: string, index: number): void { 
 
    this.selectedImageUrl = url.startsWith('http') 
      ? url 
      : `http://localhost:9090${url}`; 
 
  } 
 
  closeImageViewer(): void { 
 
    this.selectedImageUrl = ''; 
 
  } 
 
  deleteProduct(id: number): void { 
 
    const confirmed = 
      confirm( 
        'Are you sure you want to delete this product?' 
      ); 
 
    if (!confirmed) { 
      return; 
    } 
 
    this.productService 
      .delete(id) 
      .subscribe({ 
 
        next: () => { 
 
          this.loadProducts(); 
 
        }, 
 
        error: (error: any) => { 
 
          console.error( 
            'Product Delete Error:', 
            error 
          ); 
 
          this.errorMessage = 
            'Unable to delete product.'; 
 
        } 
 
      }); 
 
  } 
 
}