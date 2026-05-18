'use client';

import { useState } from 'react';
import { authService } from '../../../services/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Role } from '../../../types/role';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(Role.USHER);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register({ email, password, role });
      alert('Registration successful');
      router.push('/login');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="form-page" style={{ background: 'var(--bg)' }}>
      <div className="form-card glass" style={{ border: '1px solid rgba(212, 175, 55, 0.1)', maxWidth: '450px' }}>
        <div className="brand" style={{ justifyContent: 'center', marginBottom: '32px' }}>
          <span className="brand-mark">X</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, textAlign: 'left' }}>
            <span style={{ fontSize: '1rem', letterSpacing: '2px', fontWeight: 900 }}>PTIONS</span>
          </div>
        </div>
        
        <h1 className="luxury-heading" style={{ fontSize: '1.25rem', textAlign: 'center', marginBottom: '8px' }}>Create Account</h1>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '32px' }}>Join the elite network of operational excellence.</p>

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
          <div className="field">
            <label>Select Your Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="field"
            >
              <option value={Role.USHER}>Usher / Professional Staff</option>
              <option value={Role.CLIENT}>Client / Event Organizer</option>
            </select>
          </div>
          <button type="submit" className="button" style={{ marginTop: '20px', width: '100%' }}>
            Register Now
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--muted)' }}>
          Already part of Xptions? <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
