package com.Spring.File.service;

import com.Spring.File.model.Product;
import com.Spring.File.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;

//    private final String UPLOAD_DIR = "uploads/";

    private Path uploadPath;

    public ProductService(ProductRepository productRepository,
                          @Value("${app.file.upload-dir:uploads}")
                          String uploadDirectory) {
        this.productRepository = productRepository;
        this.uploadPath = Paths.get(uploadDirectory).toAbsolutePath().normalize();
    }



    //----------------------GET all-------------------

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    //--------------------get by id------------------------//

    public Optional<Product> getProductById(Long id) {

        return productRepository.findById(id);

    }



//    single file create

    public Product create(Product product, MultipartFile imageFile) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = saveImage(imageFile);
            product.setImageUrl(imageUrl);
            product.setImageUrls(List.of(imageUrl));
        }
        return productRepository.save(product);
    }


    // Multiple files create
    public Product createProduct(Product product, MultipartFile[] imageFiles) {

        if (imageFiles != null && imageFiles.length > 0) {

            List<String> imageUrls = new ArrayList<>();

            for (MultipartFile file : imageFiles) {

                if (!file.isEmpty()) {
                    imageUrls.add(saveImage(file));
                }
            }

            if (!imageUrls.isEmpty()) {
                product.setImageUrls(imageUrls);

                // First image as main image
                product.setImageUrl(imageUrls.get(0));
            }
        }

        return productRepository.save(product);
    }
    private String saveImage(MultipartFile imageFile) {
        try {

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }



    //------------------update---------------------//
    
//    //Get extension
//    String extension = "";
//
//            if (originalFileName != null && originalFileName.contains(".")) {
//        extension = originalFileName.substring(originalFileName.lastIndexOf("."));
//    } //.png
//
//    // Generate unique filename
//    String fileName = UUID.randomUUID() + extension;
//    //9a04efface-b1eb-47ce-9c66-63434c4a768a.png









}