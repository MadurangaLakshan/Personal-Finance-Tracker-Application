package com.example.finance_tracker.controller;

import com.example.finance_tracker.entity.Expenses;
import com.example.finance_tracker.entity.Incomes;
import com.example.finance_tracker.entity.User;
import com.example.finance_tracker.service.ExpensesService;
import com.example.finance_tracker.service.IncomesService;
import com.example.finance_tracker.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin(origins = "http://localhost:5173")
public class FinanceController {

    private final IncomesService incomesService;
    private final ExpensesService expensesService;
    private final UserService userService;

    public FinanceController(IncomesService incomesService, ExpensesService expensesService, UserService userService) {
        this.incomesService = incomesService;
        this.expensesService = expensesService;
        this.userService = userService;
    }

    @PostMapping("/add-income")
    public String addIncome(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Incomes income) {
        User user = getUserFromToken(authHeader);
        income.setUser(user);
        income.setCreatedAt(new Date());
        income.setUpdatedAt(new Date());
        incomesService.saveIncome(income);
        return "Income added successfully!";
    }

    @PostMapping("/add-expense")
    public String addExpense(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Expenses expense) {
        User user = getUserFromToken(authHeader);
        expense.setUser(user);
        expense.setCreatedAt(new Date());
        expense.setUpdatedAt(new Date());
        expensesService.saveExpense(expense);
        return "Expense added successfully!";
    }

    @GetMapping("/overview")
    public Map<String, Object> getFinancialOverview(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);

        double totalIncome = incomesService.getTotalIncomeForUser(user.getId());
        double totalExpenses = expensesService.getTotalExpensesForUser(user.getId());

        // Fetch monthly data
        List<Object[]> incomeData = incomesService.getMonthlyBreakdown(user.getId());
        List<Object[]> expenseData = expensesService.getMonthlyBreakdown(user.getId());

        // Use a Map to merge data correctly
        Map<String, double[]> monthlyMap = new LinkedHashMap<>();

        // Populate with income data
        for (Object[] row : incomeData) {
            String month = (String) row[0]; // Get month name
            double income = (Double) row[1];
            monthlyMap.put(month, new double[]{income, 0}); // Initialize with 0 expense
        }

        // Populate with expense data
        for (Object[] row : expenseData) {
            String month = (String) row[0]; // Get month name
            double expense = (Double) row[1];

            monthlyMap.putIfAbsent(month, new double[]{0, 0}); // Ensure entry exists
            monthlyMap.get(month)[1] = expense; // Set expense value
        }

        // Convert to required format for frontend charts
        List<List<Object>> monthlyBreakdown = new ArrayList<>();
        monthlyBreakdown.add(List.of("Month", "Income", "Expenses")); // Chart Header

        for (Map.Entry<String, double[]> entry : monthlyMap.entrySet()) {
            monthlyBreakdown.add(List.of(entry.getKey(), entry.getValue()[0], entry.getValue()[1]));
        }

        // Prepare final response
        Map<String, Object> response = new HashMap<>();
        response.put("totalIncome", totalIncome);
        response.put("totalExpenses", totalExpenses);
        response.put("monthlyBreakdown", monthlyBreakdown);

        return response;
    }

    @GetMapping("/transactions")
    public List<Map<String, Object>> getTransactions(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);

        // Fetch incomes and expenses for the user
        List<Incomes> incomes = incomesService.getAllIncomesForUser(user.getId());
        List<Expenses> expenses = expensesService.getAllExpensesForUser(user.getId());

        // Create a combined list of transactions
        List<Map<String, Object>> transactions = new ArrayList<>();

        // Process incomes
        for (Incomes income : incomes) {
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("id", income.getId());
            transaction.put("date", income.getDate()); // Or use a specific date field if available
            transaction.put("description", income.getDescription());
            transaction.put("category", income.getCategory());
            transaction.put("type", "income");
            transaction.put("amount", income.getAmount());
            transactions.add(transaction);
        }

        // Process expenses
        for (Expenses expense : expenses) {
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("id", expense.getId());
            transaction.put("date", expense.getDate()); // Or use a specific date field if available
            transaction.put("description", expense.getDescription());
            transaction.put("category", expense.getCategory());
            transaction.put("type", "expense");
            transaction.put("amount", expense.getAmount());
            transactions.add(transaction);
        }

        // Optionally, sort transactions by date (most recent first)
        transactions.sort((t1, t2) -> ((Date) t2.get("date")).compareTo((Date) t1.get("date")));

        return transactions;
    }

    // New DELETE endpoint for transactions
    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<String> deleteTransaction(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        User user = getUserFromToken(authHeader);

        // Try to find the income by id
        Optional<Incomes> incomeOpt = incomesService.getIncomeById(id);
        if (incomeOpt.isPresent() && incomeOpt.get().getUser().getId().equals(user.getId())) {
            incomesService.deleteIncome(id);
            return ResponseEntity.ok("Income deleted successfully!");
        }

        // Try to find the expense by id
        Optional<Expenses> expenseOpt = expensesService.getExpenseById(id);
        if (expenseOpt.isPresent() && expenseOpt.get().getUser().getId().equals(user.getId())) {
            expensesService.deleteExpense(id);
            return ResponseEntity.ok("Expense deleted successfully!");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transaction not found");
    }

    // New PUT endpoint for updating transactions
    @PutMapping("/transactions/{id}")
    public ResponseEntity<String> updateTransaction(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody Map<String, Object> transactionData) {
        User user = getUserFromToken(authHeader);

        // Expecting a "type" field in the JSON payload ("income" or "expense")
        String type = (String) transactionData.get("type");

        if ("income".equalsIgnoreCase(type)) {
            Optional<Incomes> incomeOpt = incomesService.getIncomeById(id);
            if (incomeOpt.isPresent() && incomeOpt.get().getUser().getId().equals(user.getId())) {
                Incomes income = incomeOpt.get();
                // Update fields if present in the payload
                if (transactionData.containsKey("description")) {
                    income.setDescription((String) transactionData.get("description"));
                }
                if (transactionData.containsKey("category")) {
                    income.setCategory((String) transactionData.get("category"));
                }
                if (transactionData.containsKey("amount")) {
                    income.setAmount(Double.valueOf(transactionData.get("amount").toString()));
                }
                income.setUpdatedAt(new Date());
                incomesService.saveIncome(income);
                return ResponseEntity.ok("Income updated successfully!");
            }
        } else if ("expense".equalsIgnoreCase(type)) {
            Optional<Expenses> expenseOpt = expensesService.getExpenseById(id);
            if (expenseOpt.isPresent() && expenseOpt.get().getUser().getId().equals(user.getId())) {
                Expenses expense = expenseOpt.get();
                // Update fields if present in the payload
                if (transactionData.containsKey("description")) {
                    expense.setDescription((String) transactionData.get("description"));
                }
                if (transactionData.containsKey("category")) {
                    expense.setCategory((String) transactionData.get("category"));
                }
                if (transactionData.containsKey("amount")) {
                    expense.setAmount(Double.valueOf(transactionData.get("amount").toString()));
                }
                expense.setUpdatedAt(new Date());
                expensesService.saveExpense(expense);
                return ResponseEntity.ok("Expense updated successfully!");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transaction not found");
    }


    @PostMapping(value = "/updateProfile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("username") String username,
            @RequestParam(value = "profilePic", required = false) MultipartFile profilePic) {

        try {

            User user = getUserFromToken(authHeader);

            user.setName(username);

            // Only update profilePic if a new file is provided
            if (profilePic != null && !profilePic.isEmpty()) {
                byte[] profilePicBytes = profilePic.getBytes();
                user.setProfilePic(profilePicBytes);
            }

            userService.save(user); // Save updated user

            return ResponseEntity.ok("Profile updated successfully!");
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating profile: " + e.getMessage()); // Include error message
        }
    }

    @GetMapping("/getProfile")
    public ResponseEntity<Map<String, Object>> getProfile(
            @RequestHeader("Authorization") String authHeader) {
        try {
            User user = getUserFromToken(authHeader);
            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getName());

            if (user.getProfilePic() != null) {
                response.put("profilePic", Base64.getEncoder().encodeToString(user.getProfilePic()));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    private User getUserFromToken(String authHeader) {
        if (!authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String firebaseUid = userService.getFirebaseUidFromToken(token);

        return userService.findUserByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new RuntimeException("User not found for Firebase UID: " + firebaseUid));
    }

}
