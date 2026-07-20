package com.neco.neco;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NecoApplication {

    public static void main(String[] args) {
        SpringApplication.run(NecoApplication.class, args);
    }
}
