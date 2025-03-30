import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Modal,
  TextField,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";
import useTransactionStore from "../stores/transactionStore";

const EntriesListComponent = ({ activePage }) => {
  const {
    transactions,
    fetchTransactions,
    updateTransaction,
    deleteTransaction,
  } = useTransactionStore();
  const [open, setOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlert({ ...alert, open: false });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = (transaction) => {
    setEditTransaction(transaction);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTransaction(null);
  };

  const handleSave = async () => {
    try {
      await updateTransaction(editTransaction.id, editTransaction);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  // Filter transactions based on activePage ("Incomes" or "Expenses")
  const filteredTransactions = transactions.filter((tx) =>
    activePage === "Incomes" ? tx.type === "income" : tx.type === "expense"
  );

  return (
    <Fade in={true} timeout={400}>
      <Grid item xs={12} sm={6} md={7}>
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h6">
            Current {activePage === "Incomes" ? "Incomes" : "Expenses"}
          </Typography>

          <Box sx={{ mt: 2 }}>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((entry) => (
                <Box
                  key={`${entry.type}-${entry.id}`}
                  sx={{
                    mb: 2,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {entry.description}
                    </Typography>
                    <Typography variant="body2">
                      Date: {new Date(entry.date).toLocaleDateString("en-GB")}
                    </Typography>
                    <Typography variant="body2">
                      Category: {entry.category}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: activePage === "Expenses" ? "red" : "green",
                        mt: 1,
                      }}
                    >
                      {activePage === "Expenses"
                        ? `- $${entry.amount}`
                        : `+ $${entry.amount}`}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdate(entry)}
                      size="small"
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(entry.id)}
                      size="small"
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="subtitle1" align="center">
                No transactions available.
              </Typography>
            )}
          </Box>

          {/* <Box sx={{ mt: 2 }}>
            {filteredTransactions.map((entry) => (
              <Box
                key={`${entry.type}-${entry.id}`}
                sx={{
                  mb: 2,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: 2,
                  borderRadius: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {entry.description}
                  </Typography>
                  <Typography variant="body2">
                    Date: {new Date(entry.date).toLocaleDateString("en-GB")}
                  </Typography>
                  <Typography variant="body2">
                    Category: {entry.category}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: activePage === "Expenses" ? "red" : "green",
                      mt: 1,
                    }}
                  >
                    {activePage === "Expenses"
                      ? `- $${entry.amount}`
                      : `+ $${entry.amount}`}
                  </Typography>
                </Box>

                
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdate(entry)}
                    size="small"
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(entry.id)}
                    size="small"
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Box> */}
        </Paper>

        <Modal open={open} onClose={handleClose} aria-labelledby="update-modal">
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Update Transaction
            </Typography>
            {editTransaction && (
              <>
                <TextField
                  label="Description"
                  fullWidth
                  margin="dense"
                  value={editTransaction.description}
                  onChange={(e) =>
                    setEditTransaction({
                      ...editTransaction,
                      description: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Category"
                  fullWidth
                  margin="dense"
                  value={editTransaction.category}
                  onChange={(e) =>
                    setEditTransaction({
                      ...editTransaction,
                      category: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Amount"
                  fullWidth
                  margin="dense"
                  type="number"
                  value={editTransaction.amount}
                  onChange={(e) =>
                    setEditTransaction({
                      ...editTransaction,
                      amount: e.target.value,
                    })
                  }
                />

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    color="primary"
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleClose}
                    color="error"
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>

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

export default EntriesListComponent;
