package com.neco.neco.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
public class BankListService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String bankApiUrl;

    private List<Map<String, String>> cachedBanks = new ArrayList<>();
    private long lastFetchTime = 0;

    public BankListService(@Value("${app.bank.api.url}") String bankApiUrl) {
        this.bankApiUrl = bankApiUrl;
        fetchBanks();
    }

    @Scheduled(fixedRate = 86400000)
    public void fetchBanks() {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> rawBanks = restTemplate.getForObject(bankApiUrl, List.class);

            if (rawBanks != null) {
                cachedBanks = new ArrayList<>();
                Set<String> seenNames = new HashSet<>();

                for (Map<String, Object> bank : rawBanks) {
                    String name = (String) bank.get("name");
                    String code = String.valueOf(bank.get("code"));
                    String type = (String) bank.getOrDefault("type", "");

                    if (name != null && !seenNames.contains(name.toLowerCase())) {
                        seenNames.add(name.toLowerCase());
                        Map<String, String> bankInfo = new LinkedHashMap<>();
                        bankInfo.put("name", name);
                        bankInfo.put("code", code);
                        bankInfo.put("type", type);
                        cachedBanks.add(bankInfo);
                    }
                }

                cachedBanks.sort(Comparator.comparing(b -> b.get("name")));
                lastFetchTime = System.currentTimeMillis();
                log.info("Fetched and cached {} Nigerian banks", cachedBanks.size());
            }
        } catch (Exception e) {
            log.error("Failed to fetch bank list from API: {}", e.getMessage());
            if (cachedBanks.isEmpty()) {
                loadDefaultBanks();
            }
        }
    }

    public List<Map<String, String>> getBanks() {
        if (cachedBanks.isEmpty()) {
            loadDefaultBanks();
        }
        return Collections.unmodifiableList(cachedBanks);
    }

    private void loadDefaultBanks() {
        cachedBanks = new ArrayList<>(List.of(
                Map.of("name", "Access Bank", "code", "044", "type", "commercial"),
                Map.of("name", "Citibank Nigeria", "code", "023", "type", "commercial"),
                Map.of("name", "Ecobank Nigeria", "code", "050", "type", "commercial"),
                Map.of("name", "Fidelity Bank", "code", "070", "type", "commercial"),
                Map.of("name", "First Bank of Nigeria", "code", "011", "type", "commercial"),
                Map.of("name", "First City Monument Bank", "code", "214", "type", "commercial"),
                Map.of("name", "Globus Bank", "code", "00103", "type", "commercial"),
                Map.of("name", "Guaranty Trust Bank", "code", "058", "type", "commercial"),
                Map.of("name", "Heritage Bank", "code", "030", "type", "commercial"),
                Map.of("name", "Keystone Bank", "code", "082", "type", "commercial"),
                Map.of("name", "Kuda Bank", "code", "090267", "type", "digital"),
                Map.of("name", "Opay", "code", "999992", "type", "digital"),
                Map.of("name", "PalmPay", "code", "999991", "type", "digital"),
                Map.of("name", "Polaris Bank", "code", "076", "type", "commercial"),
                Map.of("name", "Providus Bank", "code", "101", "type", "commercial"),
                Map.of("name", "Stanbic IBTC Bank", "code", "039", "type", "commercial"),
                Map.of("name", "Sterling Bank", "code", "232", "type", "commercial"),
                Map.of("name", "SunTrust Bank", "code", "100", "type", "commercial"),
                Map.of("name", "Titan Trust Bank", "code", "102", "type", "commercial"),
                Map.of("name", "Union Bank", "code", "032", "type", "commercial"),
                Map.of("name", "Unity Bank", "code", "215", "type", "commercial"),
                Map.of("name", "VFD Microfinance Bank", "code", "50315", "type", "microfinance"),
                Map.of("name", "Wema Bank", "code", "035", "type", "commercial"),
                Map.of("name", "Zenith Bank", "code", "057", "type", "commercial")));
        log.info("Loaded {} default Nigerian banks", cachedBanks.size());
    }
}
