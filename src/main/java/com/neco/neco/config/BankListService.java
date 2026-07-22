package com.neco.neco.config;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BankListService {

    private static final List<Map<String, String>> BANKS = List.of(
            Map.of("name", "Access Bank"),
            Map.of("name", "Citibank Nigeria"),
            Map.of("name", "Ecobank Nigeria"),
            Map.of("name", "Fidelity Bank"),
            Map.of("name", "First Bank of Nigeria"),
            Map.of("name", "First City Monument Bank (FCMB)"),
            Map.of("name", "Globus Bank"),
            Map.of("name", "Guaranty Trust Bank (GTBank)"),
            Map.of("name", "Keystone Bank"),
            Map.of("name", "Lotus Bank"),
            Map.of("name", "Nova Commercial Bank"),
            Map.of("name", "Optimus Bank"),
            Map.of("name", "Parallex Bank"),
            Map.of("name", "Polaris Bank"),
            Map.of("name", "PremiumTrust Bank"),
            Map.of("name", "Providus Bank"),
            Map.of("name", "Signature Bank"),
            Map.of("name", "Stanbic IBTC Bank"),
            Map.of("name", "Standard Chartered Bank Nigeria"),
            Map.of("name", "Sterling Bank"),
            Map.of("name", "SunTrust Bank Nigeria"),
            Map.of("name", "Titan Trust Bank"),
            Map.of("name", "Union Bank of Nigeria"),
            Map.of("name", "United Bank for Africa (UBA)"),
            Map.of("name", "Unity Bank"),
            Map.of("name", "Wema Bank"),
            Map.of("name", "Zenith Bank"),
            Map.of("name", "Jaiz Bank"),
            Map.of("name", "TAJ Bank")
    );

    public List<Map<String, String>> getBanks() {
        return Collections.unmodifiableList(BANKS);
    }
}
