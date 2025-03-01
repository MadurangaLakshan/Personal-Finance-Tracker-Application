package com.example.finance_tracker.repository;

import com.example.finance_tracker.entity.Incomes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IncomesRepository extends JpaRepository<Incomes, Long> {
    @Query("SELECT SUM(i.amount) FROM Incomes i WHERE i.user.id = :userId")
    Optional<Double> sumByUserId(@Param("userId") Long userId);

    @Query("SELECT TO_CHAR(i.date, 'Mon') AS month, SUM(i.amount) FROM Incomes i WHERE i.user.id = :userId GROUP BY month ORDER BY MIN(i.date)")
    List<Object[]> getMonthlyBreakdownByDate(@Param("userId") Long userId);

    List<Incomes> findByUserId(Long userId);
}

