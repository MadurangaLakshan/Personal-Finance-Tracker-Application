package com.example.finance_tracker.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Configuration
public class FirebaseConfig {

    @Value("${FIREBASE_SERVICE_ACCOUNT_JSON:}")
    private String firebaseServiceAccountJson;

    @PostConstruct
    public void initializeFirebase() {
        try {
            if (firebaseServiceAccountJson.isEmpty()) {
                throw new RuntimeException("FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set");
            }

            // Decode the Base64-encoded JSON string
            byte[] decodedBytes = Base64.getDecoder().decode(firebaseServiceAccountJson);
            InputStream serviceAccount = new ByteArrayInputStream(decodedBytes);

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize Firebase: " + e.getMessage(), e);
        }
    }
}
