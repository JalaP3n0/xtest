"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Header } from "@/components/Header";

export default function ClientSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          companyName,
          jobTitle,
          role: "CLIENT",
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data?.message || "Failed to signup");

      if (typeof window !== "undefined" && data?.token) {
        localStorage.setItem("ushereel_token", data.token);
      }
      router.push("/account?edit=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to signup");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <Header />
      <div className="form-page">
        <section className="form-card">
          <p className="eyebrow">Client Portal</p>
          <h1 className="page-title compact">Client Signup</h1>
          <p className="supporting-copy">Register your company to start booking professional usher teams.</p>

          <form onSubmit={onSubmit}>
            <label className="field">
              Full Name
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" />
            </label>
            
            <div className="account-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <label className="field">
                Company Name
                <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" />
              </label>
              <label className="field">
                Job Title
                <input required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Event Manager" />
              </label>
            </div>

            <label className="field">
              Email
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" />
            </label>

            <label className="field">
              Password
              <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>

            <button className="button" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? "Creating..." : "Create Client Account"}
            </button>
          </form>

          {error ? <p className="error-box">{error}</p> : null}

          <p className="footer-note">
            Already have an account? <Link className="text-link" href="/login/client">Log in</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
