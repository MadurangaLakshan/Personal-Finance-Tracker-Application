import { create } from "zustand";
import axios from "axios";
import { auth } from "../firebaseConfig";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useTransactionStore = create((set) => ({
  transactions: [],
  income: 0,
  expenses: 0,
  balance: 0,
  monthlyData: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const response = await axios.get(
          `${BACKEND_URL}/api/finance/transactions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        set({ transactions: response.data, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchOverviewData: async () => {
    set({ loading: true, error: null });
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const response = await axios.get(
          `${BACKEND_URL}/api/finance/overview`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const { totalIncome, totalExpenses, monthlyBreakdown } = response.data;
        set({
          income: totalIncome,
          expenses: totalExpenses,
          balance: totalIncome - totalExpenses,
          monthlyData: monthlyBreakdown,
          loading: false,
        });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addTransaction: async (type, data) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required");

      const token = await user.getIdToken();
      const endpoint =
        type === "income"
          ? `${BACKEND_URL}/api/finance/add-income`
          : `${BACKEND_URL}/api/finance/add-expense`;

      await axios.post(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Re-fetch transactions to update the list
      useTransactionStore.getState().fetchTransactions();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateTransaction: async (id, data) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required");

      const token = await user.getIdToken();
      await axios.put(`${BACKEND_URL}/api/finance/transactions/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      useTransactionStore.getState().fetchTransactions();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required");

      const token = await user.getIdToken();
      await axios.delete(`${BACKEND_URL}/api/finance/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      useTransactionStore.getState().fetchTransactions();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));

export default useTransactionStore;
