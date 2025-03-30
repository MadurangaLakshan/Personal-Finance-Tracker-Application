import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useAuthStore = create((set) => ({
  error: "",
  success: "",
  loading: false,

  signIn: async (email, password, navigate) => {
    set({ loading: true });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();

      await axios.post(
        `${BACKEND_URL}/api/auth/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/");
    } catch (err) {
      set({ error: "Invalid credentials" });
    } finally {
      set({ loading: false });
    }
  },

  // In useAuthStore's googleSignIn
  googleSignIn: async (navigate) => {
    const provider = new GoogleAuthProvider();
    try {
      console.log("trying");
      set({ loading: true, error: "" });
      console.log(auth);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log(user);
      const token = await user.getIdToken();
      await axios.post(
        `${BACKEND_URL}/api/auth/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/");
      // ... rest of the success logic
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      let message = "Google sign-in failed";
      if (error.code === "auth/popup-blocked") {
        message = "Popup blocked - please allow popups and try again";
      } else if (error.code === "auth/popup-closed-by-user") {
        message = "Popup closed - please complete the sign-in process";
      } else {
        message = error.message;
      }
      set({ error: message, loading: false });
    }
  },

  signUp: async (email, password, confirmPassword, navigate) => {
    set({ loading: true, error: "", success: "" });

    if (password !== confirmPassword) {
      set({ error: "Passwords do not match.", loading: false });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      set({
        success: "Account created successfully! You can now sign in.",
        loading: false,
      });
      navigate("/signin");
    } catch (err) {
      set({
        error: "Failed to create an account. Please try again.",
        loading: false,
      });
    }
  },

  googleSignUp: async (navigate) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      set({
        success: "Account created successfully using Google!",
        loading: false,
      });
      navigate("/signin");
    } catch (error) {
      console.error("Google Sign-Up Error:", error.message);
      set({
        error: "Failed to sign up with Google. Please try again.",
        loading: false,
      });
    }
  },
}));

export default useAuthStore;
