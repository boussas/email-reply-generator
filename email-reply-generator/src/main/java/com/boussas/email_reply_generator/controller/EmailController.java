package com.boussas.email_reply_generator.controller;

import com.boussas.email_reply_generator.dto.EmailRequest;
import com.boussas.email_reply_generator.service.EmailGeneratorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailController {
    private final EmailGeneratorService service;

    public EmailController(EmailGeneratorService service) {
        this.service = service;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest) {
        if (emailRequest.getApiKey() == null || emailRequest.getApiKey().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("API key is required");
        }

        if (emailRequest.getEmailContent() == null || emailRequest.getEmailContent().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email content is required");
        }

        try {
            String response = service.generateEmail(emailRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Error in controller: " + e.getMessage());
            e.printStackTrace();

            if (e.getMessage().contains("401") || e.getMessage().contains("403") ||
                    e.getMessage().contains("API_KEY_INVALID") || e.getMessage().contains("PERMISSION_DENIED")) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid API key. Please check your Gemini API key.");
            }
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating email: " + e.getMessage());
        }
    }
}