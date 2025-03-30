package com.example.finance_tracker.service;

import com.example.finance_tracker.entity.Expenses;
import com.example.finance_tracker.entity.Incomes;
import com.example.finance_tracker.repository.ExpensesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpensesService {

    private final ExpensesRepository expensesRepository;

    public ExpensesService(ExpensesRepository expensesRepository) {
        this.expensesRepository = expensesRepository;
    }

    public void saveExpense(Expenses expense) {
        expensesRepository.save(expense);
    }

    public double getTotalExpensesForUser(Long userId) {
        return expensesRepository.sumByUserId(userId).orElse(0.0);
    }

    public List<Object[]> getMonthlyBreakdown(Long userId) {
        return expensesRepository.getMonthlyBreakdownByDate(userId);
    }

    public List<Expenses> getAllExpensesForUser(Long userId) {
        return expensesRepository.findByUserId(userId);
    }


    public Optional<Expenses> getExpenseById(Long id) {
        return expensesRepository.findById(id);
    }


    public void deleteExpense(Long id) {
        expensesRepository.deleteById(id);
    }
}
