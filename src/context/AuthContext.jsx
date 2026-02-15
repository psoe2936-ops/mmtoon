import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext(null);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((email) =>
    email.trim().replace(/^['"]|['"]$/g, "").replace(/;+$/g, "").toLowerCase()
  )
  .filter(Boolean);
const ADMIN_UIDS = (import.meta.env.VITE_ADMIN_UIDS || "")
  .split(",")
  .map((uid) => uid.trim().replace(/^['"]|['"]$/g, "").replace(/;+$/g, ""))
  .filter(Boolean);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => signInWithPopup(auth, provider);
  const logout = async () => signOut(auth);
  const isAdmin =
    (!!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) ||
    (!!user?.uid && ADMIN_UIDS.includes(user.uid));

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      signInWithGoogle,
      logout,
    }),
    [user, loading, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
