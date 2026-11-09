
import { ProductService } from '../../../service/product.service';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { Product } from '../../../models/product';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  productForm!: FormGroup;

  isEditMode = false;
  loading = false;
  productId?: number;
  errorMessage = '';

  // ============================
  // IMAGE
  // ============================

  selectedFiles: File[] = [];

  imagePreviews: string[] = [];

  existingImageUrls: string[] = [];


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  // ============================
  // INIT
  // ============================

  ngOnInit(): void {

    this.productForm = this.fb.group({

      name: [
        '',
        Validators.required
      ],

      quantity: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      price: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ]

    });


    // Check Edit Mode

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.isEditMode = true;

      this.productId = Number(id);

      this.loadProduct(this.productId);

    }

  }


  // ============================
  // LOAD PRODUCT
  // ============================

  loadProduct(id: number): void {

    this.loading = true;

    this.productService
      .getById(id)
      .subscribe({

        next: (product: Product) => {

          // Product information

          this.productForm.patchValue({

            name: product.name,

            price: product.price,

            quantity: product.quantity

          });


          // Existing images

          this.existingImageUrls =
            product.imageUrls || [];


          // Load image URLs

          this.loadProductImages(product);


          this.loading = false;

        },


        error: (error: any) => {

          console.error(
            'Product Load Error:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Unable to load product. Please try again.';

        }

      });

  }


  // ============================
  // LOAD PRODUCT IMAGES
  // ============================

  loadProductImages(product: Product): void {

    const urls =
      product.imageUrls
        ?.filter(url => !!url?.trim()) ?? [];


    const updatedURLs =
      urls.map(url => {

        // যদি already full URL হয়

        if (url.startsWith('http')) {

          return url;

        }


        // যদি শুধু /uploads/... থাকে

        return 'http://localhost:8080' + url;

      });


    // Existing images

    this.existingImageUrls =
      updatedURLs;


    // Show existing images

    this.imagePreviews =
      [...updatedURLs];

  }


  // ============================
  // SELECT IMAGES
  // ============================

  onFilesSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;


    if (!input.files) {

      return;

    }


    const files =
      Array.from(input.files);


    files.forEach((file) => {


      // Check image

      if (!file.type.startsWith('image/')) {

        alert(
          'Only image files are allowed.'
        );

        return;

      }


      // Check image size

      if (file.size > 20 * 1024 * 1024) {

        alert(
          'Image size cannot exceed 20MB.'
        );

        return;

      }


      // Add file

      this.selectedFiles.push(file);


      // Create preview

      const reader =
        new FileReader();


      reader.onload = () => {

        this.imagePreviews.push(
          reader.result as string
        );

      };


      reader.readAsDataURL(file);

    });


    // Same file আবার select করা যাবে

    input.value = '';

  }


  // ============================
  // REMOVE IMAGE
  // ============================

  removeFile(index: number): void {


    // Existing image

    if (
      index <
      this.existingImageUrls.length
    ) {

      this.existingImageUrls.splice(
        index,
        1
      );

    }


    // New selected image

    else {

      const fileIndex =
        index -
        this.existingImageUrls.length;


      this.selectedFiles.splice(
        fileIndex,
        1
      );

    }


    // Remove preview

    this.imagePreviews.splice(
      index,
      1
    );

  }


  // ============================
  // SAVE PRODUCT
  // ============================

  saveProduct(): void {


    // Validation

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }


    // Product data

    const product: Product = {

      ...this.productForm.getRawValue(),

      id: this.productId,

      imageUrls: [
        ...this.existingImageUrls
      ]

    };


    this.loading = true;

    this.errorMessage = '';


    // ============================
    // UPDATE PRODUCT
    // ============================

    if (this.isEditMode) {


      this.productService
        .updateProduct(
          this.productId!,
          product,
          this.selectedFiles
        )
        .subscribe({

          next: () => {

            this.loading = false;

            this.router.navigate([
              '/products'
            ]);

          },


          error: (error: any) => {

            console.error(
              'Product Update Error:',
              error
            );

            this.loading = false;

            this.errorMessage =
              'Failed to update product. Please try again.';

          }

        });


    }


    // ============================
    // CREATE PRODUCT
    // ============================

    else {


      this.productService
        .create(
          product,
          this.selectedFiles
        )
        .subscribe({

          next: () => {

            this.loading = false;

            this.router.navigate([
              '/products'
            ]);

          },


          error: (error) => {

            console.error(
              'Product Create Error:',
              error
            );

            this.loading = false;

            this.errorMessage =
              'Failed to create product. Please try again.';

          }

        });

    }

  }


  // ============================
  // CANCEL
  // ============================

  cancel(): void {

    this.router.navigate([
      '/products'
    ]);

  }


  // ============================
  // VALIDATION HELPER
  // ============================

  isInvalid(fieldName: string): boolean {

    const field =
      this.productForm.get(fieldName);


    return !!(
      field &&
      field.touched &&
      field.invalid
    );

  }

}


// ### এখন সহজ করে বলি Sir-এর কোন জিনিস তোমার code-এ ছিল না

// তোমার আগের code-এ এই অংশটাই সবচেয়ে গুরুত্বপূর্ণ সমস্যা ছিল:

// // CREATE PRODUCT
// this.productService
//   .create(product, this.selectedFiles)
// ```

// তুমি `isEditMode = true` করলেও **সবসময় `create()` call করছিলে**।

// মানে:

// ```text
// Add Product
//    ↓
// create()
//    ↓
// POST
// ```

// কিন্তু Edit করলে দরকার:

// ```text
// Edit Product
//    ↓
// updateProduct()
//    ↓
// PUT
// ```

// এখন আমার দেওয়া code-এ:

// ```typescript
// if (this.isEditMode) {
//     updateProduct(...)
// } else {
//     create(...)
// }
// ```

// এই logic করা হয়েছে।

// ### Image-এর জন্য Sir-এর গুরুত্বপূর্ণ অংশ

// Sir-এর code-এ ছিল:

// ```typescript
// loadProductImages(product: Product)
// ```

// এটা তোমার code-এ ছিল না।

// কারণ backend যদি দেয়:

// ```text
// /uploads/products/abc.jpg
// ```

// তাহলে browser সরাসরি সেটা নাও পেতে পারে।

// তাই আমরা করি:

// ```typescript
// return 'http://localhost:8080' + url;
// ```

// ফলে:

// ```text
// /uploads/products/abc.jpg
// ```

// হয়ে যায়:

// ```text
// http://localhost:8080/uploads/products/abc.jpg
// ```

// ### আরেকটা গুরুত্বপূর্ণ ব্যাপার

// তোমার Sir-এর code-এ:

// ```typescript
// if (file.size > 20 * 1024 * 1024)
// ```

// কিন্তু message ছিল:

// ```text
// Image size cannot exceed 10MB.
// ```

// এখানে **code 20MB**, কিন্তু message **10MB**—দুটো মিলছে না।

// আমি তোমার code-এ **20MB + 20MB message** করেছি।

// ---

// **তবে একটা জিনিস এখন নিশ্চিত করতে হবে:** তোমার `ProductService`-এ সত্যিই এই method আছে কি না:

// ```typescript
// updateProduct(
//   id: number,
//   product: Product,
//   imageFiles: File[]
// )
// ```

// যদি না থাকে, তাহলে এই TS-এ error আসবে। **তোমার `product.service.ts`-টা দাও**, আমি তোমার বর্তমান backend-এর সাথে মিলিয়ে `create + update + image + delete existing image` পুরোটা ঠিক করে দেব।
