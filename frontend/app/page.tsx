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
          <div className="button-row" style={{ justifyContent: "center", marginTop: "32px" }}>
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
      <section id="about" className="panel" style={{ marginTop: "80px", padding: "64px 32px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p className="eyebrow">About Us</p>
          <h2 className="section-title">Defining Operational Intelligence</h2>
          <p className="lede" style={{ fontSize: "1.1rem" }}>
            Xptions was founded on a simple premise: complexity should never be a barrier to growth. 
            We build the systems that work behind the scenes, ensuring your operations are as seamless 
            as your vision.
          </p>
          
          <div className="choice-grid" style={{ marginTop: "48px", textAlign: "left" }}>
            <div className="metric-card">
              <div className="metric-title">Our Mission</div>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
                To bridge the gap between high-level strategy and ground-level execution through 
                proprietary technology and expert management.
              </p>
            </div>
            <div className="metric-card">
              <div className="metric-title">Our Vision</div>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
                To become the global standard for integrated operational systems, powering the 
                next generation of efficient enterprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UsheReel Showcase (Flagship Service) */}
      <section id="services" style={{ marginTop: "100px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p className="eyebrow">Flagship Service</p>
          <h2 className="page-title compact">UsheReel by Xptions</h2>
          <p className="lede">
            Our premier event staffing and management solution. 
            Designed for precision, built for scale.
          </p>
        </div>

        <div className="choice-grid">
          <article className="choice-card">
            <div>
              <span className="choice-icon">C</span>
              <h2>Client Portal</h2>
              <p>For organizers and teams managing staffing needs, event schedules, and real-time operations.</p>
            </div>
            <div className="button-row">
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
              <h2>Usher Access</h2>
              <p>For the professional teams on the ground. Manage assignments, check-ins, and performance.</p>
            </div>
            <div className="button-row">
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
      <section style={{ marginTop: "100px" }}>
        <h2 className="section-title" style={{ textAlign: "center", marginBottom: "40px" }}>Core Expertise</h2>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-title">Connected</div>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "8px" }}>
              Working as one strong network to ensure every event is a seamless success.
            </p>
          </div>
          <div className="metric-card">
            <div className="metric-title">Innovative</div>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "8px" }}>
              Creative solutions and proprietary technology that stand out in the industry.
            </p>
          </div>
          <div className="metric-card">
            <div className="metric-title">Reliable</div>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "8px" }}>
              You can count on us, every time. Precision staff for precision operations.
            </p>
          </div>
          <div className="metric-card">
            <div className="metric-title">Exceptional</div>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "8px" }}>
              Delivering memorable experiences through excellence and digital transformation.
            </p>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: "100px", borderTop: "1px solid var(--line)", padding: "48px 0", textAlign: "center" }}>
        <div className="brand" style={{ marginBottom: "16px", justifyContent: "center" }}>
          <span className="brand-mark" style={{ fontStyle: 'italic', letterSpacing: '-1.5px' }}>X</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, textAlign: 'left' }}>
            <span style={{ fontSize: '1rem', letterSpacing: '1.5px', fontWeight: 900 }}>PTIONS</span>
            <span style={{ fontSize: '0.35rem', letterSpacing: '0.5px', color: 'var(--muted)', marginTop: '1px', fontWeight: 500 }}>WE RUN THE EVENT. YOU OWN THE MOMENT.</span>
          </div>
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Empowering operations through Xptions Intelligence.
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "24px" }}>
          &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Xptions. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
