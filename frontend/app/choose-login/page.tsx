import Link from "next/link";
import { Header } from "@/components/Header";

export default function LoginChooserPage() {
  return (
    <main className="app-shell">
      <Header />

      <p className="eyebrow">Access</p>
      <h1 className="page-title compact">Choose Login Type</h1>
      <p className="lede">Pick the workspace that matches how you use UsheReel.</p>

      <section className="choice-grid">
        <article className="choice-card">
          <div>
            <span className="choice-icon">C</span>
            <h2>Client Login</h2>
            <p>For organizers and teams managing staffing needs.</p>
          </div>
          <Link className="button" href="/login/client">
            Continue as Client
          </Link>
        </article>
        <article className="choice-card">
          <div>
            <span className="choice-icon">U</span>
            <h2>Usher Login</h2>
            <p>For ushers handling bookings, attendance, and profiles.</p>
          </div>
          <Link className="button" href="/login/usher">
            Continue as Usher
          </Link>
        </article>
      </section>

      <p className="footer-note">
        New here?{" "}
        <Link className="text-link" href="/signup">
          Create account
        </Link>
      </p>
    </main>
  );
}
