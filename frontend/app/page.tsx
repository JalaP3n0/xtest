"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";

type UserInfo = {
  id: string;
  name: string;
  role: string;
  nickname?: string;
  phone?: string;
  gender?: string;
  usher?: {
    bio?: string;
    experience?: string;
    profilePhoto?: string;
    languages?: any[];
  };
  clientProfile?: {
    companyName?: string;
    jobTitle?: string;
    industry?: string;
    bio?: string;
  };
};

export default function Home() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("ushereel_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          
          // Check completeness
          let complete = true;
          if (data.role === "CLIENT") {
            const cp = data.clientProfile;
            if (!cp?.companyName || !cp?.jobTitle || !cp?.industry || !cp?.bio) complete = false;
          } else if (data.role === "USHER") {
            const u = data.usher;
            if (!data.phone || !data.gender || !u?.bio || !u?.experience || !u?.profilePhoto) complete = false;
          }
          setIsComplete(complete);
        } else {
          localStorage.removeItem("ushereel_token");
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <main className="app-shell">
      <Header />

      {user && !isComplete && (
        <div className="error-box" style={{ marginBottom: 32, background: 'var(--accent-soft)', borderColor: 'var(--accent)', color: 'var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Complete your profile!</strong> 
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', opacity: 0.8 }}>Add more details to increase your visibility and trust on the platform.</p>
          </div>
          <Link href="/account?edit=true" className="button" style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '0.75rem' }}>
            Complete Now
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Innovation at Scale</p>
          <h1 className="page-title">Xptions</h1>
          <p className="lede">
            Architecting the future of operational excellence and digital transformation. 
            We provide specialized solutions that empower industries to lead with precision.
          </p>
          <div className="button-row" style={{ justifyContent: "center", marginTop: "48px", gap: "20px" }}>
            {loading ? (
              <button className="button" disabled>Loading...</button>
            ) : user ? (
              <>
                <Link className="button" href={user.role === "ADMIN" ? "/admin" : "/account"}>
                  Go to {user.role === "ADMIN" ? "Dashboard" : "My Account"}
                </Link>
                {user.role === "CLIENT" && (
                  <Link className="button secondary" href="/events/new">Create New Event</Link>
                )}
                {user.role === "USHER" && (
                  <Link className="button secondary" href="/bookings">View My Bookings</Link>
                )}
              </>
            ) : (
              <>
                <Link className="button" href="#services">Explore Our Services</Link>
                <Link className="button secondary" href="#about">Our Story</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="panel" style={{ marginTop: "100px", padding: "80px 40px", background: "var(--bg-subtle)", border: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p className="eyebrow">About Us</p>
          <h2 className="page-title compact" style={{ marginBottom: "24px" }}>Defining Operational Intelligence</h2>
          <p className="lede" style={{ fontSize: "1.1rem" }}>
            Xptions was founded on a simple premise: complexity should never be a barrier to growth. 
            We build the systems that work behind the scenes, ensuring your operations are as seamless 
            as your vision.
          </p>
          
          <div className="choice-grid" style={{ marginTop: "64px", textAlign: "left" }}>
            <div className="metric-card" style={{ padding: "40px", borderTop: "2px solid var(--accent)" }}>
              <div className="metric-title" style={{ color: "var(--accent)", marginBottom: "16px" }}>Our Mission</div>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                To bridge the gap between high-level strategy and ground-level execution through 
                proprietary technology and expert management.
              </p>
            </div>
            <div className="metric-card" style={{ padding: "40px", borderTop: "2px solid var(--accent)" }}>
              <div className="metric-title" style={{ color: "var(--accent)", marginBottom: "16px" }}>Our Vision</div>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                To become the global standard for integrated operational systems, powering the 
                next generation of efficient enterprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UsheReel Showcase (Flagship Service) */}
      <section id="services" style={{ marginTop: "140px" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p className="eyebrow">Flagship Service</p>
          <h2 className="page-title compact">UsheReel <span className="gold-text" style={{ fontSize: "0.8em" }}>by Xptions</span></h2>
          <p className="lede">
            Our premier event staffing and management solution. 
            Designed for precision, built for scale.
          </p>
        </div>

        <div className="choice-grid">
          <article className="choice-card">
            <div>
              <span className="choice-icon">C</span>
              <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px', marginTop: '24px' }}>Client Portal</h2>
              <p style={{ marginTop: '16px' }}>For organizers and teams managing staffing needs, event schedules, and real-time operations.</p>
            </div>
            <div className="button-row" style={{ marginTop: '32px' }}>
              {user?.role === "CLIENT" ? (
                <Link className="button" href="/account">Manage Company</Link>
              ) : (
                <>
                  <Link className="button" href="/login/client">Client Login</Link>
                  {!user && <Link className="button secondary" href="/signup/client">Get Started</Link>}
                </>
              )}
            </div>
          </article>

          <article className="choice-card">
            <div>
              <span className="choice-icon">U</span>
              <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px', marginTop: '24px' }}>Usher Access</h2>
              <p style={{ marginTop: '16px' }}>For the professional teams on the ground. Manage assignments, check-ins, and performance.</p>
            </div>
            <div className="button-row" style={{ marginTop: '32px' }}>
              {user?.role === "USHER" ? (
                <Link className="button" href="/account">My Profile</Link>
              ) : (
                <>
                  <Link className="button" href="/login/usher">Usher Login</Link>
                  {!user && <Link className="button secondary" href="/signup/usher">Join the Team</Link>}
                </>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* Services Overview */}
      <section style={{ marginTop: "140px", paddingBottom: "100px" }}>
        <h2 className="luxury-heading" style={{ textAlign: "center", marginBottom: "60px", fontSize: "1.5rem", color: "var(--accent)" }}>Core Expertise</h2>
        <div className="metric-grid">
          {[
            { title: 'Connected', desc: 'Working as one strong network to ensure every event is a seamless success.' },
            { title: 'Innovative', desc: 'Creative solutions and proprietary technology that stand out in the industry.' },
            { title: 'Reliable', desc: 'You can count on us, every time. Precision staff for precision operations.' },
            { title: 'Exceptional', desc: 'Delivering memorable experiences through excellence and digital transformation.' }
          ].map((item, idx) => (
            <div key={idx} className="metric-card" style={{ padding: "32px", background: "rgba(255,255,255,0.02)" }}>
              <div className="metric-title" style={{ letterSpacing: "2px" }}>{item.title}</div>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "12px", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: "140px", borderTop: "1px solid var(--line)", padding: "100px 0", textAlign: "center", background: "rgba(255,255,255,0.01)", backdropFilter: "blur(4px)" }}>
        <div className="brand" style={{ marginBottom: "32px", justifyContent: "center" }}>
          <span className="brand-mark">X</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, textAlign: 'left' }}>
            <span style={{ fontSize: '1.2rem', letterSpacing: '3px', fontWeight: 900 }}>PTIONS</span>
            <span style={{ fontSize: '0.5rem', letterSpacing: '1px', color: 'var(--muted)', marginTop: '2px', fontWeight: 700 }}>INTELLIGENCE AT SCALE</span>
          </div>
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.8 }}>
          Empowering operations through Xptions Intelligence.
        </p>
        <div style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "24px", fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
          <Link href="/privacy" style={{ opacity: 0.6 }}>Privacy Policy</Link>
          <Link href="/terms" style={{ opacity: 0.6 }}>Terms of Service</Link>
          <Link href="/contact" style={{ opacity: 0.6 }}>Contact Us</Link>
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "48px", opacity: 0.4 }}>
          &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Xptions. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
