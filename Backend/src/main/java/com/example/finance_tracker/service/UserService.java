package com.example.finance_tracker.service;

import com.example.finance_tracker.entity.User;
import com.example.finance_tracker.repository.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findOrCreateUser(String firebaseUid, String email, String name) {
        // Check if user already exists
        User existingUser = userRepository.findByFirebaseUid(firebaseUid);
        if (existingUser != null) {
            return existingUser;
        }

        // Create and save new user
        User newUser = new User();
        newUser.setFirebaseUid(firebaseUid);
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setCreatedAt(new Date());
        return userRepository.save(newUser);
    }

    public Optional<User> findUserByFirebaseUid(String firebaseUid) {
        return Optional.ofNullable(userRepository.findByFirebaseUid(firebaseUid));
    }

    public String getFirebaseUidFromToken(String token) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            return decodedToken.getUid(); // This is the correct Firebase UID
        } catch (Exception e) {
            throw new RuntimeException("Invalid Firebase token", e);
        }
    }

    // Save or update a user
    public User save(User user) {
        return userRepository.save(user);
    }
}
