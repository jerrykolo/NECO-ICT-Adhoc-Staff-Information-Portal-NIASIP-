package com.neco.neco.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Staff ID is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
