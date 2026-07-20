package com.neco.neco.bank;

import com.neco.neco.bank.dto.BankDetailsRequest;
import com.neco.neco.bank.dto.BankDetailsResponse;
import com.neco.neco.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/staff/bank-details")
@RequiredArgsConstructor
public class BankDetailsController {

    private final BankDetailsService bankDetailsService;

    @GetMapping
    public ResponseEntity<ApiResponse<BankDetailsResponse>> getBankDetails() {
        BankDetailsResponse response = bankDetailsService.getOwnBankDetails();
        return ResponseEntity.ok(ApiResponse.success("Bank details retrieved", response));
    }

    @PutMapping("/draft")
    public ResponseEntity<ApiResponse<BankDetailsResponse>> saveDraft(
            @Valid @RequestBody BankDetailsRequest request) {
        BankDetailsResponse response = bankDetailsService.saveDraft(request);
        return ResponseEntity.ok(ApiResponse.success("Draft saved", response));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<BankDetailsResponse>> submit(
            @Valid @RequestBody BankDetailsRequest request) {
        BankDetailsResponse response = bankDetailsService.submit(request);
        return ResponseEntity.ok(ApiResponse.success("Bank details submitted for approval", response));
    }
}
