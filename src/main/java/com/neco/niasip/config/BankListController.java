package com.neco.niasip.config;

import com.neco.niasip.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/banks")
@RequiredArgsConstructor
public class BankListController {

    private final BankListService bankListService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getBanks() {
        List<Map<String, String>> banks = bankListService.getBanks();
        return ResponseEntity.ok(ApiResponse.success("Banks retrieved", banks));
    }

    @GetMapping("/refresh")
    public ResponseEntity<ApiResponse<Void>> refreshBanks() {
        bankListService.fetchBanks();
        return ResponseEntity.ok(ApiResponse.success("Bank list refreshed"));
    }
}
