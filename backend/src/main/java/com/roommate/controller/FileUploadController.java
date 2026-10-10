package com.roommate.controller;

import com.roommate.dto.common.ApiResponse;
import com.roommate.util.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/upload")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/property-image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadPropertyImage(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeFile(file, "properties");
        return ResponseEntity.ok(ApiResponse.ok("Image uploaded successfully", Map.of("url", url)));
    }

    @PostMapping("/avatar")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeFile(file, "avatars");
        return ResponseEntity.ok(ApiResponse.ok("Avatar uploaded successfully", Map.of("url", url)));
    }
}
