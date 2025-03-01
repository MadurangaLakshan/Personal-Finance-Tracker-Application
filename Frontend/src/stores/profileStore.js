import { create } from "zustand";
import axios from "axios";
import { auth } from "../firebaseConfig";

const useProfileStore = create((set) => ({
  profile: {
    email: "",
    username: "",
    profilePic: "",
    loading: false,
    error: null,
  },

  fetchProfile: async () => {
    set((state) => ({
      profile: { ...state.profile, loading: true, error: null },
    }));
    try {
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();
        const response = await axios.get(
          "http://localhost:8081/api/finance/getProfile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data;
        console.log(data);

        set({
          profile: {
            email: user.email || "",
            username: data.username || "",
            profilePic: data.profilePic
              ? `data:image/jpeg;base64,${data.profilePic}`
              : "",
            loading: false,
            error: null,
          },
        });
      }
    } catch (error) {
      set((state) => ({
        profile: { ...state.profile, loading: false, error: error.message },
      }));
    }
  },

  updateProfile: async (username, profilePicFile) => {
    set((state) => ({
      profile: { ...state.profile, loading: true, error: null },
    }));
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required");

      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append("username", username);
      if (profilePicFile) formData.append("profilePic", profilePicFile);

      await axios.post(
        "http://localhost:8081/api/finance/updateProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Refresh profile data after update
      useProfileStore.getState().fetchProfile();
    } catch (error) {
      set((state) => ({
        profile: { ...state.profile, loading: false, error: error.message },
      }));
      throw error;
    }
  },

  logout: async () => {
    try {
      await auth.signOut();
      // Reset store state on logout
      set({
        transactions: [],
        income: 0,
        expenses: 0,
        balance: 0,
        monthlyData: [],
        profile: {
          username: "",
          profilePic: "",
          loading: false,
          error: null,
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));

export default useProfileStore;
