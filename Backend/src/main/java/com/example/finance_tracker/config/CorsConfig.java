package com.example.finance_tracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allow all endpoints
                        .allowedOrigins("http://localhost:5173") // Allow requests from the frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // HTTP methods allowed
                        .allowedHeaders("*") // Allow all headers
                        .allowCredentials(true); // Allow cookies/credentials
            }
        };
    }
}
