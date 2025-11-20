package com.boussas.email_reply_generator.service;

import com.boussas.email_reply_generator.dto.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Service
public class EmailGeneratorService {
    private final WebClient webClient;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    private static final String GEMINI_API_BASE_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public String generateEmail(EmailRequest emailRequest) {
        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                }
        );

        try {
            System.out.println("Calling Gemini API...");
            System.out.println("API Key starts with: " + emailRequest.getApiKey().substring(0, Math.min(10, emailRequest.getApiKey().length())));

            String fullUrl = GEMINI_API_BASE_URL + "?key=" + emailRequest.getApiKey();

            String response = webClient.post()
                    .uri(fullUrl)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("Received response from Gemini API");
            return extractResponseContent(response);

        } catch (WebClientResponseException e) {
            System.err.println("WebClient error: " + e.getStatusCode() + " - " + e.getMessage());
            System.err.println("Response body: " + e.getResponseBodyAsString());

            if (e.getStatusCode().value() == 401 || e.getStatusCode().value() == 403) {
                throw new RuntimeException("API_KEY_INVALID: Invalid or missing API key");
            }
            if (e.getStatusCode().value() == 400) {
                throw new RuntimeException("Bad request to Gemini API: " + e.getResponseBodyAsString());
            }
            throw new RuntimeException("Gemini API Error [" + e.getStatusCode() + "]: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error calling Gemini API: " + e.getMessage());
        }
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            if (root.has("error")) {
                String errorMessage = root.path("error").path("message").asText();
                throw new RuntimeException("Gemini API Error: " + errorMessage);
            }
            JsonNode textNode = root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            if (textNode.isMissingNode() || textNode.asText().isEmpty()) {
                throw new RuntimeException("No text content in response");
            }

            return textNode.asText();
        } catch (Exception e) {
            System.err.println("Error parsing response: " + e.getMessage());
            System.err.println("Response was: " + response);
            throw new RuntimeException("Error parsing Gemini response: " + e.getMessage());
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate an email reply with the same email content language for the following email content, ");
        prompt.append("without a subject line or anything besides email content, just email body nothing else.");

        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("\nTone: ").append(emailRequest.getTone());
        }

        prompt.append("\n\nOriginal email content: ").append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}