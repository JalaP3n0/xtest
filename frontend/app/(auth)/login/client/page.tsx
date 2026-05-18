"use client";

import { useState } from 'react';
import { authService } from '../../../../services/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';

export default function ClientLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login({ email, password });
      router.push('/admin'); // Clients go to admin/dashboard
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">
      <Header />
      <div className="form-card glass" style={{ width: '100%', maxWidth: '480px' }}>
        <div className="brand" style={{ justifyContent: 'center', marginBottom: '40px' }}>
          <span className="brand-mark" style={{ width: '48px', height: '48px', fontSize: '1.6rem' }}>X</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textAlign: 'left' }}>
            <span style={{ fontSize: '1.4rem', letterSpacing: '4px', fontWeight: 900 }}>PTIONS</span>
            <span style={{ fontSize: '0.6rem', letterSpacing: '1px', color: 'var(--muted)', fontWeight: 700 }}>EXECUTIVE PORTAL</span>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p className="eyebrow" style={{ color: 'var(--muted)', letterSpacing: '4px' }}>Secure Login</p>
          <h1 className="luxury-heading" style={{ fontSize: '1.75rem', marginTop: '12px' }}>Welcome Back</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Professional Email</label>
            <input
              type="email"
              placeholder="director@company.com"
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
          
          {error && <p className="error-box" style={{ marginTop: '24px', textAlign: 'center' }}>{error}</p>}
          
          <button type="submit" className="button" style={{ marginTop: '32px', width: '100%', height: '54px' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
          </button>
        </form>

        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted)', letterSpacing: '0.5px' }}>
          New partner? <Link href="/signup/client" style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', marginLeft: '8px' }}>Create Corporate Account</Link>
        </div>
      </div>
    </main>
  );
}
