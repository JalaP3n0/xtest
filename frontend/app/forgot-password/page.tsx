"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Header } from "@/components/Header";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <Header />
      <div className="form-page">
        <section className="form-card">
          <h1 className="page-title compact">Reset Password</h1>
          <p className="supporting-copy">Enter your email and we'll send you a link to reset your password.</p>

          {!message ? (
            <form onSubmit={onSubmit}>
              <label className="field">
                Email Address
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                />
              </label>

              <button className="button" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="status-pill" style={{ color: "var(--success)", borderColor: "var(--success)", background: "transparent", display: "block", marginTop: 24, padding: 16 }}>
              {message}
            </div>
          )}

          {error ? <p className="error-box" style={{ marginTop: 24 }}>{error}</p> : null}

          <p className="footer-note">
            Remember your password? <Link className="text-link" href="/login">Log in</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
