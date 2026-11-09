
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;


  constructor(private http: HttpClient) { }


  // ============================
  // Get All Products
  // ============================

  getAll(): Observable<Product[]> {

    return this.http.get<Product[]>(
      this.apiUrl
    );

  }


  // ============================
  // Get Product By ID
  // ============================

  getById(id: number): Observable<Product> {

    return this.http.get<Product>(
      `${this.apiUrl}/${id}`
    );

  }


  // ============================
  // Create Without Image
  // ============================

  createWithoutImg(product: Product) {

    return this.http.post(
      `${this.apiUrl}/test`,
      product
    );

  }


  // ============================
  // Create Product
  // ============================

  create(
    product: Product,
    imageFiles?: File[]
  ): Observable<Product> {

    const formData = new FormData();


    formData.append(
      'product',
      new Blob(
        [
          JSON.stringify(product)
        ],
        {
          type: 'application/json'
        }
      )
    );


    if (
      imageFiles &&
      imageFiles.length > 0
    ) {

      imageFiles.forEach(file => {

        formData.append(
          'images',
          file
        );

      });

    }


    return this.http.post<Product>(
      this.apiUrl,
      formData
    );

  }


  // ============================
  // Update Product
  // ============================

  updateProduct(
    id: number,
    product: Product,
    imageFiles?: File[]
  ): Observable<Product> {

    const formData = new FormData();


    // Product JSON

    formData.append(
      'product',
      new Blob(
        [
          JSON.stringify(product)
        ],
        {
          type: 'application/json'
        }
      )
    );


    // New Images

    if (
      imageFiles &&
      imageFiles.length > 0
    ) {

      imageFiles.forEach(file => {

        formData.append(
          'images',
          file
        );

      });

    }


    return this.http.put<Product>(
      `${this.apiUrl}/${id}`,
      formData
    );

  }


  // ============================
  // Old Update
  // ============================

  update(
    id: number,
    product: Product
  ): Observable<Product> {

    return this.http.put<Product>(
      `${this.apiUrl}/${id}`,
      product
    );

  }


  // ============================
  // Delete Product
  // ============================

  delete(id: number): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        responseType: 'text'
      }
    );

  }

}
