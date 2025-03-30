import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CSVLink } from "react-csv";
import useTransactionStore from "../stores/transactionStore";
import { useTransition, animated } from "@react-spring/web";

const AnimatedTableRow = animated(TableRow);

const OverviewComponent = () => {
  const theme = useTheme();
  const {
    income,
    expenses,
    balance,
    monthlyData,
    transactions,
    fetchOverviewData,
    fetchTransactions,
    loading,
  } = useTransactionStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    fetchOverviewData();
    fetchTransactions();
  }, [fetchOverviewData, fetchTransactions]);

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter((tx) => {
        const matchesType = filterType === "all" || tx.type === filterType;
        const matchesCategory =
          filterCategory === "all" || tx.category === filterCategory;
        const matchesSearch = tx.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesType && matchesCategory && matchesSearch;
      })
    : [];

  const transitions = useTransition(filteredTransactions, {
    keys: (tx) => `${tx.type}-${tx.id}`,
    from: { opacity: 0, transform: "translateY(10px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-10px)" },
    config: { tension: 200, friction: 25 },
  });
  const headers = [
    { label: "Date", key: "date" },
    { label: "Description", key: "description" },
    { label: "Type", key: "type" },
    { label: "Category", key: "category" },
    { label: "Amount", key: "amount" },
  ];

  const prepareData = () =>
    filteredTransactions.map((tx) => ({
      date: new Date(tx.date).toISOString().split("T")[0],
      description: tx.description,
      type: tx.type,
      category: tx.category,
      amount: `$${tx.amount}`,
    }));

  const pieData = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses },
    { name: "Balance", value: balance },
  ];

  const barData =
    monthlyData && monthlyData.length > 1
      ? monthlyData.slice(1).map((item) => {
          // Ensure item has the necessary elements before accessing them.
          const name = item[0] !== undefined ? item[0] : "";
          const income = item[1] !== undefined ? item[1] : 0;
          const expenses = item[2] !== undefined ? item[2] : 0;
          return {
            name: name,
            income: income,
            expenses: expenses,
          };
        })
      : [];

  if (loading) {
    return <div>Loading financial data...</div>;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Typography variant="body2">{label}</Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color || entry.fill }}
            >
              {entry.name}: ${entry.value}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.grey[500],
  ];

  return (
    <Grid container spacing={3} justifyContent="center">
      {/* Totals Cards */}
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h6">Total Balance</Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            ${balance || 0}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h6">Total Income</Typography>
          <Typography variant="h5" sx={{ mt: 2, color: "green" }}>
            ${income || 0}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h6">Total Expenses</Typography>
          <Typography variant="h5" sx={{ mt: 2, color: "red" }}>
            ${expenses || 0}
          </Typography>
        </Paper>
      </Grid>

      {/* Charts Section */}
      <Grid item xs={12} sm={6}>
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, height: 400 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Balance Overview
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span style={{ color: theme.palette.text.primary }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, height: 400 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Income vs Expenses
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: theme.palette.text.primary }}
              />
              <YAxis
                tick={{ fill: theme.palette.text.primary }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => (
                  <span style={{ color: theme.palette.text.primary }}>
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill={theme.palette.primary.main}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill={theme.palette.secondary.main}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Transactions Table Section */}

      <Grid item xs={12}>
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
          {/* ... existing table header/filter code ... */}

          <Typography variant="h6" sx={{ mb: 2 }}>
            Transactions
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  label="Filter by Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Category</InputLabel>
                <Select
                  value={filterCategory}
                  label="Filter by Category"
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Transport">Transport</MenuItem>
                  <MenuItem value="Utilities">Utilities</MenuItem>
                  <MenuItem value="Entertainment">Entertainment</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* CSV Export Button */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item>
              <CSVLink
                data={prepareData()}
                headers={headers}
                filename={"transactions.csv"}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "inline-block",
                  padding: "8px 16px",
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Export to CSV
              </CSVLink>
            </Grid>
          </Grid>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transitions((style, tx) => (
                  <AnimatedTableRow key={`${tx.type}-${tx.id}`} style={style}>
                    <TableCell>
                      {new Date(tx.date).toISOString().split("T")[0]}
                    </TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.category}</TableCell>
                    <TableCell align="right">${tx.amount}</TableCell>
                  </AnimatedTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OverviewComponent;
