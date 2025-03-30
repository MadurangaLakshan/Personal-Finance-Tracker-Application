package com.example.finance_tracker.controller;

import com.example.finance_tracker.entity.User;
import com.example.finance_tracker.service.FirebaseTokenVerifier;
import com.example.finance_tracker.service.UserService;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping({"/api/auth"})
@CrossOrigin(origins = {"http://localhost:5173"})
public class AuthController {
    private final FirebaseTokenVerifier firebaseTokenVerifier;
    private final UserService userService;

    public AuthController(FirebaseTokenVerifier firebaseTokenVerifier, UserService userService) {
        this.firebaseTokenVerifier = firebaseTokenVerifier;
        this.userService = userService;
    }

    @PostMapping({"/verify"})
    public String verifyToken(@RequestHeader("Authorization") String authHeader) {

        if (!authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        } else {
            String token = authHeader.substring(7);
            FirebaseToken decodedToken = this.firebaseTokenVerifier.verifyToken(token);

            String firebaseUid = decodedToken.getUid();
            String email = decodedToken.getEmail();
            String name = (String) decodedToken.getClaims().get("name");

            // Persist user in the database if not already present
            User user = userService.findOrCreateUser(firebaseUid, email, name);

            System.out.println("valid valid valid");

            return "Token is valid for user: " + user.getFirebaseUid();
        }
    }
}
