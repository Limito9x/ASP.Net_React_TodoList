import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { Input, Checkbox } from "antd";

type LoginPayload = {
    userName: string;
    password: string;
    remember: boolean;
};

type ApiError = {
    message: string;
};

export default function LoginPage() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [remember, setRemember] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const userNameRef = useRef<HTMLInputElement | null>(null);
    const { login } = useAuth();

    const validate = (payload: LoginPayload): string | null => {
        if (!payload.userName.trim()) {
            return "Username is required.";
        }
        if (!payload.password) {
            return "Password is required.";
        }
        return null;
    };

    const submitLogin = async (payload: LoginPayload) => {
        setLoading(true);
        setError(null);

        try {
            const result = await authService.login({
                userName: payload.userName,
                password: payload.password,
            });
            
            await login({ token: result.token, newUser: result });
            navigate("/");
        } catch (err: any) {
            const apiError: ApiError = err.response?.data;
            console.log("Login error:", apiError);
            setError(apiError?.message || "An unexpected error occurred.");
            if (userNameRef.current) {
                userNameRef.current.focus();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const payload: LoginPayload = { userName, password, remember };
        const validationError = validate(payload);
        if (validationError) {
            setError(validationError);
            return;
        }
        submitLogin(payload);
    };

    return (
      <main
        aria-labelledby="login-heading"
        style={{ maxWidth: 420, margin: "2rem auto", padding: "0 1rem" }}
      >
        <h1 id="login-heading">Sign in</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="userName">Username</label>
            <Input
              id="userName"
              value={userName}
              onChange={(s) => setUserName(s.target.value)}
              autoComplete="username"
              required
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                marginTop: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(s) => setPassword(s.target.value)}
              autoComplete="current-password"
              required
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                marginTop: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          {error && (
            <div role="alert" style={{ color: "crimson", marginBottom: 12 }}>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <Link
              to="/register"
              style={{ marginLeft: 16 }}
            >
              Register
            </Link>
            <Link
              to="/"
              style={{ marginLeft: 16 }}
            >
              Back to Home
            </Link>
          </div>
        </form>
      </main>
    );
}