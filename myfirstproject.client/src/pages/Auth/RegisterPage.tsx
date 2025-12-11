import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

type FormState = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
};

type ApiError = {
  message: string;
  field?: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (!form.username.trim()) {
      next.username = 'Username is required';
    } else if (form.username.length < 3) {
      next.username = 'Username must be at least 3 characters';
    }

    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Invalid email address';
    }

    if (!form.password) {
      next.password = 'Password is required';
    } else if (form.password.length < 6) {
      next.password = 'Password must be at least 6 characters';
    }

    if (form.password !== form.confirmPassword) {
      next.confirmPassword = 'Passwords do not match';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        userName: form.username,
        email: form.email,
        fullName: form.fullName,
        password: form.password
      });

      alert('Registration successful! Please log in.');
    } catch (err: any) {
      const apiError: ApiError = err.response?.data;
      console.log('Registration error:', apiError);
      if (apiError.field) {
        setErrors(prev => ({ ...prev, [apiError.field!]: apiError.message }));
      } else {
        setServerError(apiError?.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // clear field-specific error while editing
    setErrors(prev => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    setServerError(null);
  }

  return (
    <div className="auth-page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} noValidate aria-describedby="server-error">
        {serverError && (
          <div
            id="server-error"
            role="alert"
            style={{ color: "var(--danger, #b00020)" }}
          >
            {serverError}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "err-username" : undefined}
            autoComplete="username"
          />
          {errors.username && (
            <div
              id="err-username"
              role="alert"
              style={{ color: "var(--danger, #b00020)" }}
            >
              {errors.username}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "err-email" : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <div
              id="err-email"
              role="alert"
              style={{ color: "var(--danger, #b00020)" }}
            >
              {errors.email}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "err-fullName" : undefined}
            autoComplete="username"
          />
          {errors.fullName && (
            <div
              id="err-fullName"
              role="alert"
              style={{ color: "var(--danger, #b00020)" }}
            >
              {errors.fullName}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "err-password" : undefined}
            autoComplete="new-password"
          />
          {errors.password && (
            <div
              id="err-password"
              role="alert"
              style={{ color: "var(--danger, #b00020)" }}
            >
              {errors.password}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "err-confirmPassword" : undefined
            }
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <div
              id="err-confirmPassword"
              role="alert"
              style={{ color: "var(--danger, #b00020)" }}
            >
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Registering�" : "Register"}
          </button>
        </div>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{ marginLeft: "0.5rem" }}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}