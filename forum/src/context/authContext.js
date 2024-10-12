import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase";
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendPasswordResetEmail, 
  updateProfile, 
  updateEmail, 
  updatePassword 
} from "firebase/auth";

// Tworzymy kontekst autoryzacji
const AuthContext = React.createContext(null);

// Hook do użycia kontekstu autoryzacji
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Stan zalogowanego użytkownika
  const [loading, setLoading] = useState(true); // Stan ładowania
  const provider = new GoogleAuthProvider(); // Inicjalizacja Google Auth Provider

  // Funkcja do tworzenia nowego użytkownika z ustawieniem displayName
  async function signup(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username }); // Ustawienie displayName
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }

  // Funkcja logowania przez email i hasło
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken(true); // Pobierz token
      localStorage.setItem('accessToken', token); // Zapisz token w localStorage
      return token;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  // Funkcja resetowania hasła
  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  // Funkcja aktualizacji profilu (displayName, photoURL)
  async function updateUserProfile(updates) {
    if (!currentUser) {
      console.error("No current user found.");
      return;
    }
    try {
      await updateProfile(currentUser, updates);
      setCurrentUser((prev) => ({ ...prev, ...updates }));
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }  

  // Funkcja aktualizacji e-maila
  async function updateUserEmail(newEmail) {
    if (currentUser) {
      try {
        await updateEmail(currentUser, newEmail);
        setCurrentUser((prev) => ({ ...prev, email: newEmail })); // Update email in state
        console.log("Email updated successfully");
      } catch (error) {
        console.error("Error updating email:", error);
        throw error;
      }
    } else {
      console.error("No current user found.");
    }
  }

  // Funkcja aktualizacji hasła
  async function updateUserPassword(newPassword) {
    if (currentUser) {
      try {
        await updatePassword(currentUser, newPassword);
        console.log("Password updated successfully");
      } catch (error) {
        console.error("Error updating password:", error);
        throw error;
      }
    } else {
      console.error("No current user found.");
    }
  }

  // Monitorowanie zmian w stanie autoryzacji użytkownika
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const token = await user.getIdToken(true); 
        localStorage.setItem('accessToken', token);
      } else {
        setCurrentUser(null);
        localStorage.removeItem('accessToken');
      }
      setLoading(false);
    }, (error) => {
      console.error("Error in authentication state change:", error);
      setLoading(false);
    });

    return () => {
      unsubscribe(); 
    };
  }, []);
  
  // Przekazywane wartości w kontekście
  const value = {
    currentUser,
    signup,
    login,
    resetPassword,
    updateUserProfile, // Dodano aktualizację profilu
    updateUserEmail,   // Dodano aktualizację e-maila
    updateUserPassword // Dodano aktualizację hasła
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export const signInWithGooglePopup = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user; // Użytkownik, który się zalogował
    const token = await user.getIdToken(true); // Pobierz token ID
    localStorage.setItem('accessToken', token); // Zapisz token w localStorage
    return token; // Zwróć token
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    throw error; // Przekazanie błędu do wywołującego
  }
};
