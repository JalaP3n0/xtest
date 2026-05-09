import Link from "next/link";
import { Header } from "@/components/Header";

export default function SignupChooserPage() {
  return (
    <main className="app-shell">
      <Header />

      <p className="eyebrow">Onboarding</p>

      <h1 className="page-title compact">Choose Signup Type</h1>
      <p className="lede">Choose the role you want to build from.</p>

      <section className="choice-grid">
        <article className="choice-card">
          <div>
            <span className="choice-icon">C</span>
            <h2>Client Signup</h2>
            <p>For event organizers and agencies booking usher teams.</p>
          </div>
          <Link className="button" href="/signup/client">
            Continue as Client
          </Link>
        </article>
        <article className="choice-card">
          <div>
            <span className="choice-icon">U</span>
            <h2>Usher Signup</h2>
            <p>For ushers joining the talent network and receiving bookings.</p>
          </div>
          <Link className="button" href="/signup/usher">
            Continue as Usher
          </Link>
        </article>
      </section>

      <p className="footer-note">
        Already have an account?{" "}
        <Link className="text-link" href="/login">
          Log in
        </Link>
      </p>
    </main>
  );
}
