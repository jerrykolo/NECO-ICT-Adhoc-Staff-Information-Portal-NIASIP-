package com.neco.neco.config;

import com.neco.neco.common.ApiResponse;
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


}
