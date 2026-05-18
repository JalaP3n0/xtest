"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";

export default function AnalyticsDashboardPage() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    usherCount: 0,
    leadConversion: "0%",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data
    setTimeout(() => {
      setStats({
        totalEvents: 12,
        activeEvents: 4,
        usherCount: 85,
        leadConversion: "28%",
      });
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <main className="app-shell">
      <Header />
      
      <div className="content-container">
        <header style={{ marginBottom: '64px' }}>
          <p className="eyebrow">Performance Intelligence</p>
          <h1 className="page-title compact">Operational Analytics</h1>
          <p className="lede">Insights across your company's events and marketing campaigns.</p>
        </header>
        
        {loading ? (
          <p className="empty-state">Aggregating real-time operational data...</p>
        ) : (
          <div className="stats-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '32px',
            marginTop: '32px'
          }}>
            <div className="metric-card glass" style={{ padding: '40px', textAlign: 'center', borderTop: '2px solid var(--accent)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}>Total Portfolio</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, margin: '16px 0', letterSpacing: '-1px' }}>{stats.totalEvents}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>↑ 20% vs LAST MONTH</div>
            </div>

            <div className="metric-card glass" style={{ padding: '40px', textAlign: 'center', borderTop: '2px solid var(--accent)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}>Active Operations</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, margin: '16px 0', letterSpacing: '-1px' }}>{stats.activeEvents}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>ACROSS 3 VENUES</div>
            </div>

            <div className="metric-card glass" style={{ padding: '40px', textAlign: 'center', borderTop: '2px solid var(--accent)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}>Verified Ushers</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, margin: '16px 0', letterSpacing: '-1px' }}>{stats.usherCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>ACTIVE PROFILES</div>
            </div>

            <div className="metric-card glass" style={{ padding: '40px', textAlign: 'center', borderTop: '2px solid var(--accent)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}>Conversion Rate</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, margin: '16px 0', letterSpacing: '-1px' }}>{stats.leadConversion}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>QR CAMPAIGN ALPHA</div>
            </div>
          </div>
        )}

        <div className="panel glass" style={{ marginTop: '48px', padding: '48px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 className="luxury-heading" style={{ fontSize: '1.25rem', marginBottom: '32px' }}>Operational Trends</h3>
          <div style={{ 
            height: '350px', 
            background: 'rgba(255,255,255,0.01)', 
            borderRadius: 'var(--radius)', 
            marginTop: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'var(--muted)',
            border: '1px solid rgba(255,255,255,0.05)',
            fontSize: '0.9rem',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            [ Intelligent Visualization: Attendance vs. Proximity Metrics ]
          </div>
        </div>
      </div>
    </main>
  );
}
