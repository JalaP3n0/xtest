"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("ushereel_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ushereel_token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="app-topbar">
      <Link href="/" className="brand" aria-label="Xptions home">
        <span className="brand-mark">X</span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '1.2rem', letterSpacing: '3px', fontWeight: 900 }}>PTIONS</span>
          <span style={{ fontSize: '0.5rem', letterSpacing: '1px', color: 'var(--muted)', marginTop: '2px', fontWeight: 700 }}>INTELLIGENCE AT SCALE</span>
        </div>
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        <Link className="nav-link" href="/#about">
          About
        </Link>
        <Link className="nav-link" href="/#services">
          Services
        </Link>
        {isLoggedIn ? (
          <div className="dropdown-container">
            <div className="dropdown-trigger nav-link" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              ACCOUNT
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div className="dropdown-menu">
              <Link className="dropdown-item" href="/account">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                My Profile
              </Link>
              <Link className="dropdown-item" href="/dashboard">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
                Dashboard
              </Link>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link className="nav-link" href="/login">
              Login
            </Link>
            <Link className="button" href="/signup" style={{ marginLeft: '12px' }}>
              Join Us
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
