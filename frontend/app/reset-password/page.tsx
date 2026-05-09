"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import { Header } from "@/components/Header";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="app-shell"><Header /><div className="panel"><p className="empty-state">Loading...</p></div></main>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  if (!email || !token) {
    return (
      <main className="app-shell">
        <Header />
        <div className="panel">
          <p className="error-box">Invalid or missing reset token. Please request a new one.</p>
          <Link href="/forgot-password" className="button" style={{ marginTop: 16 }}>
            Request Reset
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <Header />
      <div className="form-page">
        <section className="form-card">
          <h1 className="page-title compact">New Password</h1>
          <p className="supporting-copy">Create a secure new password for your account.</p>

          {!success ? (
            <form onSubmit={onSubmit}>
              <label className="field">
                New Password
                <input
                  required
                  minLength={6}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>

              <label className="field">
                Confirm New Password
                <input
                  required
                  minLength={6}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>

              <button className="button" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          ) : (
            <div className="status-pill" style={{ color: "var(--success)", borderColor: "var(--success)", background: "transparent", display: "block", marginTop: 24, padding: 16 }}>
              Password updated successfully! Redirecting to login...
            </div>
          )}

          {error ? <p className="error-box" style={{ marginTop: 24 }}>{error}</p> : null}
        </section>
      </div>
    </main>
  );
}
