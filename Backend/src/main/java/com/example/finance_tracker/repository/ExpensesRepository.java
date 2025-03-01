package com.example.finance_tracker.repository;

import com.example.finance_tracker.entity.Expenses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExpensesRepository extends JpaRepository<Expenses, Long> {
    @Query("SELECT SUM(e.amount) FROM Expenses e WHERE e.user.id = :userId")
    Optional<Double> sumByUserId(@Param("userId") Long userId);

    @Query("SELECT TO_CHAR(e.date, 'Mon') AS month, SUM(e.amount) FROM Expenses e WHERE e.user.id = :userId GROUP BY month ORDER BY MIN(e.date)")
    List<Object[]> getMonthlyBreakdownByDate(@Param("userId") Long userId);

    List<Expenses> findByUserId(Long userId);
}
