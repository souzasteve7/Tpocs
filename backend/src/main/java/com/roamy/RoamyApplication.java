package com.roamy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaRepositories
// @EnableCaching  // Temporarily disabled to avoid Redis dependency
@EnableAsync
public class RoamyApplication {

    public static void main(String[] args) {
        SpringApplication.run(RoamyApplication.class, args);
    }
}