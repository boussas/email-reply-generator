package com.boussas.email_reply_generator.dto;

import lombok.Data;
@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
    private String apiKey;
}