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
        <span className="brand-mark" style={{ fontStyle: 'italic', letterSpacing: '-2px' }}>X</span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '1.2rem', letterSpacing: '2px', fontWeight: 900 }}>PTIONS</span>
          <span style={{ fontSize: '0.45rem', letterSpacing: '0.5px', color: 'var(--muted)', marginTop: '2px', fontWeight: 500 }}>WE RUN THE EVENT. YOU OWN THE MOMENT.</span>
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
          <>
            <Link className="nav-link" href="/account">
              Account
            </Link>
            <button className="button secondary" onClick={handleLogout} style={{ marginLeft: '8px', padding: '6px 12px', minHeight: 'auto' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" href="/login">
              Login
            </Link>
            <Link className="button" href="/signup">
              Join Us
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
