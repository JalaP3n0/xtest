"use client";

import React from 'react';

export function LuxuryPreview() {
  return (
    <div style={{
      backgroundColor: '#050505',
      color: '#F5F5F5',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '60px'
    }}>
      {/* 1. Header Sample */}
      <header style={{
        width: '100%',
        maxWidth: '1200px',
        padding: '20px 32px',
        background: 'rgba(20, 20, 20, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        position: 'sticky',
        top: '20px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F1D37E 50%, #B8860B 100%)',
            borderRadius: '6px',
            display: 'grid',
            placeItems: 'center',
            color: '#050505',
            fontWeight: 900,
            fontSize: '1.4rem',
            fontStyle: 'italic'
          }}>X</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: '1.2rem', letterSpacing: '3px', fontWeight: 900 }}>PTIONS</span>
            <span style={{ fontSize: '0.5rem', letterSpacing: '1px', color: '#888', marginTop: '2px' }}>INTELLIGENCE AT SCALE</span>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px' }}>
          <span style={{ color: '#D4AF37', cursor: 'pointer' }}>DASHBOARD</span>
          <span style={{ color: '#888', cursor: 'pointer' }}>SERVICES</span>
          <span style={{ color: '#888', cursor: 'pointer' }}>ANALYTICS</span>
        </nav>
      </header>

      {/* 2. Hero Section Sample */}
      <section style={{ textAlign: 'center', maxWidth: '800px', padding: '60px 0' }}>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 800,
          letterSpacing: '4px',
          color: '#D4AF37',
          textTransform: 'uppercase',
          marginBottom: '16px',
          display: 'block'
        }}>Premier Event Staffing</span>
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 900,
          margin: '0',
          lineHeight: 0.9,
          letterSpacing: '-2px',
          textTransform: 'uppercase',
          background: 'linear-gradient(to bottom, #FFF 30%, #888 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>UsheReel</h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#888',
          marginTop: '24px',
          lineHeight: 1.6,
          maxWidth: '600px',
          marginInline: 'auto'
        }}>
          Architecting excellence in ground operations. 
          Precision, prestige, and unparalleled digital integration.
        </p>
        <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F1D37E 50%, #B8860B 100%)',
            color: '#050505',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 700,
            letterSpacing: '1px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
          }}>GET STARTED</button>
          <button style={{
            padding: '14px 32px',
            background: 'transparent',
            color: '#FFF',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            fontWeight: 700,
            letterSpacing: '1px',
            cursor: 'pointer'
          }}>VIEW CASE STUDIES</button>
        </div>
      </section>

      {/* 3. Card Sample */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        width: '100%',
        maxWidth: '1200px',
        paddingBottom: '80px'
      }}>
        {[
          { title: 'Global Operations', desc: 'Centralized management for multi-city event portfolios.' },
          { title: 'AI Staffing', desc: 'Predictive modeling for optimized usher placement.' },
          { title: 'Real-time Analytics', desc: 'Live data streams from the ground directly to your dashboard.' }
        ].map((item, i) => (
          <div key={i} style={{
            padding: '40px',
            background: '#111',
            border: '1px solid #222',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)'
            }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>{item.title}</h3>
            <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {item.desc} Experience the pinnacle of operational intelligence with our proprietary tracking systems.
            </p>
            <div style={{ marginTop: '24px', color: '#D4AF37', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '1px', cursor: 'pointer' }}>
              EXPLORE SOLUTION &rarr;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
