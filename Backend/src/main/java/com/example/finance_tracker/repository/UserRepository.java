package com.example.finance_tracker.repository;

import com.example.finance_tracker.entity.User;
import com.google.firebase.database.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Nullable
    User findByFirebaseUid(String firebaseUid);
}
