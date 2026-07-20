package com.neco.neco.staff.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class StaffUpdateRequest {

    @Pattern(regexp = "^[0-9]{11}$", message = "Phone number must be 11 digits")
    private String phoneNumber;

    @Email(message = "Invalid email address")
    private String email;
}
