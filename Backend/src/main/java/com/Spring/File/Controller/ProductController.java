
        package com.Spring.File.Controller;

import com.Spring.File.execption.FileStorageException;
import com.Spring.File.execption.ProductNotFoundException;
import com.Spring.File.model.Product;
import com.Spring.File.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ------------------- GET ALL -------------------
    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        List<Product> products = productService.getAll();
        return ResponseEntity.ok(products);
    }

    // ------------------- GET BY ID -------------------
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {

        Optional<Product> product = productService.getProductById(id);

        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        }

        return ResponseEntity.notFound().build();
    }

    // ------------------- CREATE -------------------

    // Multiple files upload
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> createProductMultipleImg(
            @RequestPart("product") Product product,
            @RequestPart(value = "images", required = false)
            MultipartFile[] imageFiles) throws FileStorageException {

        System.out.println("IMAGE FILE COUNT = " +
                (imageFiles == null ? "NULL" : imageFiles.length));

        Product savedProduct =
                productService.createProduct(product, imageFiles);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedProduct);
    }

    // Multiple files upload
    @PostMapping(value = "/test")
    public ResponseEntity<Product> create(
            @RequestBody Product product) throws FileStorageException {

        MultipartFile[] mtf = null;

        Product savedProduct =
                productService.createProduct(product, mtf);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedProduct);
    }


    // ------------------- UPDATE -------------------

//    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<Product> updateProduct(
//            @PathVariable Long id,
//            @RequestPart("product") Product productDetails,
//            @RequestPart(value = "images", required = false)
//            MultipartFile[] imageFiles) {
//
//        try {
//            Product updatedProduct =
//                    productService.updateProduct(id, productDetails, imageFiles);
//
//            return ResponseEntity.ok(updatedProduct);
//
//        } catch (ProductNotFoundException | FileStorageException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }


    // ------------------- DELETE -------------------

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
//
//        try {
//            productService.deleteProduct(id);
//            return ResponseEntity.noContent().build();
//
//        } catch (ProductNotFoundException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }

}
