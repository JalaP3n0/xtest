"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function UsherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to login");
      }

      const role = data?.user?.role;
      if (role !== "USHER") {
        throw new Error("This login page is for ushers only.");
      }

      if (typeof window !== "undefined" && data?.token) {
        localStorage.setItem("ushereel_token", data.token);
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell form-page">
      <section className="form-card">
        <Link href="/" className="brand" aria-label="Xptions home">
          <span className="brand-mark" style={{ fontStyle: 'italic', letterSpacing: '-2px' }}>X</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: '1.2rem', letterSpacing: '2px', fontWeight: 900 }}>PTIONS</span>
            <span style={{ fontSize: '0.45rem', letterSpacing: '0.5px', color: 'var(--muted)', marginTop: '2px', fontWeight: 500 }}>WE RUN THE EVENT. YOU OWN THE MOMENT.</span>
          </div>
        </Link>
        <p className="eyebrow">Usher workspace</p>
        <h1 className="page-title compact">Usher Login</h1>
        <p className="supporting-copy">Log in to manage availability and bookings.</p>

        <form onSubmit={onSubmit}>
          <label className="field">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
          <label className="field">
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

          <div style={{ textAlign: 'right', marginTop: -12 }}>
            <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              Forgot password?
            </Link>
          </div>

          <button className="button" disabled={loading}>
          {loading ? "Logging in..." : "Log In as Usher"}
        </button>
      </form>

        {error ? <p className="error-box">{error}</p> : null}

        <p className="footer-note">
          Don't have an account?{" "}
          <Link className="text-link" href="/signup/usher">
            Create account
          </Link>
        </p>

        <p className="footer-note">
          Client account?{" "}
          <Link className="text-link" href="/login/client">
            Log in as client
          </Link>
      </p>
      </section>
    </main>
  );
}
