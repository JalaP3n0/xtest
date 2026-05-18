"use client";

import { useState } from "react";
import { Header } from "@/components/Header";

export default function SupervisorVerifyPage() {
  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleQRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qrCode) setStep(2);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    // Simulate API call to verification endpoint
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setStep(3);
    }, 2000);
  };

  return (
    <main className="app-shell">
      <Header />
      
      <div className="content-container" style={{ maxWidth: '520px', margin: '0 auto' }}>
        <header style={{ marginBottom: '64px', textAlign: 'center' }}>
          <p className="eyebrow">On-Ground Operations</p>
          <h1 className="page-title compact" style={{ fontSize: '2rem' }}>Usher Verification</h1>
          <p className="lede" style={{ fontSize: '1rem' }}>Dual-factor check-in for professional staff.</p>
        </header>
        
        <div className="stepper" style={{ marginBottom: '48px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: step === s ? 'var(--gold-gradient)' : step > s ? 'var(--accent-soft)' : 'rgba(255,255,255,0.05)',
              color: step === s ? 'var(--accent-strong)' : step > s ? 'var(--accent)' : 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.9rem',
              border: step > s ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.4s ease',
              boxShadow: step === s ? '0 0 20px rgba(212, 175, 55, 0.3)' : 'none'
            }}>
              {step > s ? '✓' : s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={handleQRSubmit} className="form-card glass" style={{ padding: '48px' }}>
            <h3 className="luxury-heading" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Step 1: Identity Token</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '32px', lineHeight: 1.6 }}>Scan or enter the encrypted QR code displayed on the usher's verified mobile device.</p>
            <div className="field">
              <label>Verification Code</label>
              <input 
                type="text" 
                value={qrCode} 
                onChange={(e) => setQrCode(e.target.value)} 
                placeholder="e.g. AUTH-XP-9921"
                required
              />
            </div>
            <button type="submit" className="button" style={{ width: '100%', height: '54px', marginTop: '12px' }}>
              INITIALIZE PHASE 2
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="form-card glass" style={{ padding: '48px' }}>
            <h3 className="luxury-heading" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Step 2: Visual Evidence</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '32px', lineHeight: 1.6 }}>Capture a live photo of the staff member at the assigned venue location.</p>
            
            <div style={{ 
              height: '240px', 
              background: 'rgba(255,255,255,0.01)', 
              border: '1px dashed rgba(212, 175, 55, 0.3)',
              borderRadius: 'var(--radius)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '24px 0',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }} onClick={() => document.getElementById('photo-input')?.click()}>
              {photo ? (
                <div style={{ textAlign: 'center' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>IMAGE ENCRYPTED</span>
                  <small style={{ color: 'var(--muted)' }}>{photo.name}</small>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', opacity: 0.8 }}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block' }}>Open Secure Camera</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              id="photo-input" 
              style={{ display: 'none' }} 
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
            />

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button onClick={() => setStep(1)} className="button secondary" style={{ flex: 1 }}>BACK</button>
              <button onClick={handleVerify} className="button" style={{ flex: 2 }} disabled={!photo || loading}>
                {loading ? 'PROCESSING...' : 'FINALIZE CHECK-IN'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-card glass" style={{ padding: '64px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.1)', 
              display: 'grid', 
              placeItems: 'center', 
              margin: '0 auto 32px',
              border: '2px solid var(--success)'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="luxury-heading" style={{ color: 'var(--success)', marginBottom: '16px' }}>Access Authorized</h3>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Usher has been successfully verified and logged into the active event roster.</p>
            <button onClick={() => { setStep(1); setQrCode(""); setPhoto(null); }} className="button" style={{ marginTop: '40px', width: '100%' }}>
              VERIFY NEXT STAFF
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
