package com.neco.niasip;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NiasipApplication {

    public static void main(String[] args) {
        SpringApplication.run(NiasipApplication.class, args);
    }
}
