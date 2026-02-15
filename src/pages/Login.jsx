import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Login = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const redirectTo = location.state?.from || "/";

  if (!loading && user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithGoogle();
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(loginError.message || t("login.failed"));
    }
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-8 pb-24 md:pb-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white">{t("login.title")}</h1>
        <p className="mt-2 text-slate-300">
          {t("login.desc")}
        </p>

        <button
          onClick={handleGoogleLogin}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-3 font-semibold text-black"
        >
          {t("login.google")}
        </button>

        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      </div>
    </main>
  );
};

export default Login;
