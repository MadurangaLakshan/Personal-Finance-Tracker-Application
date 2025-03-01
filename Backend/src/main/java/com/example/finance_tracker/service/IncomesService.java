package com.example.finance_tracker.service;

import com.example.finance_tracker.entity.Incomes;
import com.example.finance_tracker.repository.IncomesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncomesService {

    private final IncomesRepository incomesRepository;

    public IncomesService(IncomesRepository incomesRepository) {
        this.incomesRepository = incomesRepository;
    }

    public void saveIncome(Incomes income) {
        incomesRepository.save(income);
    }

    public double getTotalIncomeForUser(Long userId) {
        return incomesRepository.sumByUserId(userId).orElse(0.0);
    }

    public List<Object[]> getMonthlyBreakdown(Long userId) {
        return incomesRepository.getMonthlyBreakdownByDate(userId);
    }

    public List<Incomes> getAllIncomesForUser(Long userId) {
        return incomesRepository.findByUserId(userId);
    }

    // New method: Get an Income by its id
    public Optional<Incomes> getIncomeById(Long id) {
        return incomesRepository.findById(id);
    }

    // New method: Delete an Income by its id
    public void deleteIncome(Long id) {
        incomesRepository.deleteById(id);
    }
}
