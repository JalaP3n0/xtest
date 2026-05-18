"use client";

import { useEffect, useState, use } from "react";
import { Header } from "@/components/Header";
import { eventsService } from "@/services/events.service";

interface Recommendation {
  id: string;
  userId: string;
  bio: string;
  experience: string;
  rating: number;
  reliabilityScore: number;
  similarity: number;
  explanation: string;
}

export default function StaffingRecommendationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await eventsService.getRecommendations(id);
        setRecommendations(response.data);
      } catch (err: any) {
        setError("Failed to load recommendations. Make sure your OpenAI API key is configured.");
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, [id]);

  return (
    <main className="app-shell">
      <Header />
      
      <div className="content-container">
        <header style={{ marginBottom: '64px' }}>
          <p className="eyebrow">AI Staffing Intelligence</p>
          <h1 className="page-title compact">Talent Matching</h1>
          <p className="lede">Optimized usher recommendations for Event <span className="gold-text" style={{ fontSize: '0.9em' }}>{id}</span></p>
        </header>
        
        {loading ? (
          <p className="empty-state">Analyzing global usher profiles and performance metrics...</p>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : recommendations.length === 0 ? (
          <p className="empty-state">No matching ushers found for this event's criteria.</p>
        ) : (
          <div className="recommendations-list" style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '32px' }}>
            {recommendations.map((rec) => (
              <div key={rec.id} className="choice-card glass" style={{ 
                minHeight: 'auto', 
                padding: '40px',
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.01)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="luxury-heading" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Usher ID: {rec.userId}</h3>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
                      <span>⭐ Rating: <span style={{ color: 'var(--ink)' }}>{rec.rating}</span></span>
                      <span>Reliability: <span style={{ color: 'var(--ink)' }}>{rec.reliabilityScore}%</span></span>
                    </div>
                  </div>
                  <div style={{ 
                    background: 'var(--gold-gradient)', 
                    color: 'var(--accent-strong)', 
                    padding: '8px 16px', 
                    borderRadius: 'var(--radius)', 
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    letterSpacing: '1px',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
                  }}>
                    {Math.round(rec.similarity * 100)}% MATCH
                  </div>
                </div>
                
                <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(212, 175, 55, 0.03)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--accent)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>AI Match Reasoning</div>
                  <p style={{ fontStyle: 'italic', margin: '0', color: 'var(--ink)', opacity: 0.9, lineHeight: 1.6, fontSize: '0.95rem' }}>
                    "{rec.explanation}"
                  </p>
                </div>

                <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                  <button className="button" style={{ padding: '12px 32px' }}>
                    SEND INVITATION
                  </button>
                  <button className="button secondary" style={{ padding: '12px 32px' }}>
                    VIEW PROFILE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
