import React, { useState, useEffect } from "react";
import {
  FormGroup,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Fade } from "@mui/material";
import useTransactionStore from "../stores/transactionStore";

const FormComponent = ({ activePage }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "",
    description: "",
    amount: "",
  });

  const addTransaction = useTransactionStore((state) => state.addTransaction);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const incomeCategories = ["Salary", "Freelancing", "Investments", "Other"];

  const expenseCategories = [
    "Food",
    "Insurance",
    "Health",
    "Bills",
    "Transportation",
    "Other",
  ];

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlert({ ...alert, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const type = activePage === "Incomes" ? "income" : "expense";
      await addTransaction(type, formData);

      setAlert({
        open: true,
        message: `${activePage.slice(0, -1)} added successfully!`,
        severity: "success",
      });

      setFormData({
        title: "",
        date: "",
        category: "",
        description: "",
        amount: "",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || "Failed to add transaction",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    setFormData({
      title: "",
      date: "",
      category: "",
      description: "",
      amount: "",
    });
  }, [activePage]);

  return (
    <Fade in={true} timeout={400}>
      <Grid item xs={12} sm={6} md={5}>
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add {activePage === "Incomes" ? "Income" : "Expense"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {(activePage === "Incomes"
                    ? incomeCategories
                    : expenseCategories
                  ).map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Add {activePage === "Incomes" ? "Income" : "Expense"}
              </Button>
            </FormGroup>
          </form>
        </Paper>

        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleAlertClose}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Grid>
    </Fade>
  );
};

export default FormComponent;
