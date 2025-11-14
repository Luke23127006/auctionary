import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import AuthLayout from "../../layouts/AuthLayout"; // 1. Import layout
import Button from "../../components/ui/Button"; // Assuming Button/Input are in ui/
import Input from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth"; // Assuming hook is in contexts/
import "./AuthForms.css"; // 7. Import common CSS for forms

// 2. Get Site Key from .env (Vite)
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function LoginPage() {
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { login } = useAuth();

  // 3. Update state according to schema: username -> email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 4. Get reCAPTCHA token
    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      setIsLoading(false);
      return;
    }

    try {
      // 5. Call login function with the new schema
      await login(email, password, recaptchaToken);
      // useAuth will automatically redirect on success
    } catch (err: any) {
      setError(err.message || "Login failed.");
      recaptchaRef.current?.reset(); // Reset reCAPTCHA on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 6. Use AuthLayout, pass in the title
    <AuthLayout title="Log in to Auctionary">
      <form className="auth-form" onSubmit={handleLogin}>
        <Input
          type="email" // 3. Update
          placeholder="Email" // 3. Update
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />

        <div className="recaptcha-container">
          <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <div className="button-group">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </form>

      <Button
        variant="secondary"
        onClick={() => navigate("/signup")}
        disabled={isLoading}
        className="switch-auth-button"
      >
        Don't have an account? Sign Up
      </Button>

      <a
        href="#"
        className="auth-link" // 7. Use common CSS class
        onClick={(e) => {
          e.preventDefault();
          navigate("/forgot-password");
        }}
      >
        Forgot password?
      </a>
    </AuthLayout>
  );
}
