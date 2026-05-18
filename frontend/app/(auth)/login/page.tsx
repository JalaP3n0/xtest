'use client';

import { useState } from 'react';
import { authService } from '../../../services/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login({ email, password });
      router.push('/dashboard');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="form-page" style={{ background: 'var(--bg)' }}>
      <div className="form-card glass" style={{ border: '1px solid rgba(212, 175, 55, 0.1)' }}>
        <div className="brand" style={{ justifyContent: 'center', marginBottom: '32px' }}>
          <span className="brand-mark">X</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, textAlign: 'left' }}>
            <span style={{ fontSize: '1rem', letterSpacing: '2px', fontWeight: 900 }}>PTIONS</span>
          </div>
        </div>
        
        <h1 className="luxury-heading" style={{ fontSize: '1.25rem', textAlign: 'center', marginBottom: '8px' }}>Welcome Back</h1>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '32px' }}>Enter your credentials to access the portal.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. david@xptions.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button" style={{ marginTop: '12px', width: '100%' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--muted)' }}>
          Don't have an account? <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Join Xptions</Link>
        </div>
      </div>
    </div>
  );
}
