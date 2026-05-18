"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Header } from "@/components/Header";

export default function UsherSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
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
          nickname,
          email,
          gender,
          phone,
          password,
          role: "USHER",
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
          <p className="eyebrow">Usher Onboarding</p>
          <h1 className="page-title compact">Join our Team</h1>
          <p className="supporting-copy">Create your professional usher profile to start receiving bookings.</p>

          <form onSubmit={onSubmit}>
            <div className="account-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <label className="field">
                Full Name
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
              </label>
              <label className="field">
                Nickname
                <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Johnny" />
              </label>
            </div>

            <label className="field">
              Email
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
            </label>

            <div className="account-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="field">
                <label>Gender</label>
                <select 
                  required 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <label className="field">
                Phone
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+123456789" />
              </label>
            </div>

            <label className="field">
              Password
              <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>

            <button className="button" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? "Creating..." : "Create Usher Account"}
            </button>
          </form>

          {error ? <p className="error-box">{error}</p> : null}

          <p className="footer-note">
            Already have an account? <Link className="text-link" href="/login/usher">Log in</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
