"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { eventsService } from "@/services/events.service";

interface Event {
  id: string;
  name: string;
  status: string;
  date: string;
  requiredUshers: number;
}

export default function AdminApprovalsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsService.getAll();
      setEvents(response.data);
    } catch (err: any) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await eventsService.approve(id);
      // Refresh list
      fetchEvents();
    } catch (err: any) {
      alert("Failed to approve event");
    }
  };

  return (
    <main className="app-shell">
      <Header />
      
      <div className="content-container">
        <header style={{ marginBottom: '64px' }}>
          <p className="eyebrow">Event Oversight</p>
          <h1 className="page-title compact">Admin Approvals</h1>
          <p className="lede">Review and authorize pending event registrations.</p>
        </header>
        
        {loading ? (
          <p className="empty-state">Retrieving event pipeline...</p>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : events.length === 0 ? (
          <p className="empty-state">No events requiring approval at this time.</p>
        ) : (
          <div className="table-wrap glass" style={{ marginTop: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ padding: '20px 24px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Event Identity</th>
                  <th style={{ padding: '20px 24px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Schedule</th>
                  <th style={{ padding: '20px 24px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Staff Requirement</th>
                  <th style={{ padding: '20px 24px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Status</th>
                  <th style={{ padding: '20px 24px', textAlign: 'right', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Operations</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td style={{ padding: '20px 24px' }}>
                      <strong style={{ color: 'var(--ink)' }}>{event.name}</strong>
                    </td>
                    <td style={{ padding: '20px 24px', color: 'var(--muted)', fontSize: '0.85rem' }}>
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ fontWeight: 700 }}>{event.requiredUshers}</span> <small style={{ color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Ushers</small>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 900, 
                        letterSpacing: '1px', 
                        textTransform: 'uppercase',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: event.status === "PENDING" ? 'var(--accent-soft)' : 'rgba(16, 185, 129, 0.1)',
                        color: event.status === "PENDING" ? 'var(--accent)' : 'var(--success)',
                        border: `1px solid ${event.status === "PENDING" ? 'rgba(212, 175, 55, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                      }}>
                        {event.status}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      {event.status === "PENDING" && (
                        <button 
                          onClick={() => handleApprove(event.id)}
                          className="button"
                          style={{ padding: '8px 20px', minHeight: 'auto', fontSize: '0.75rem' }}
                        >
                          AUTHORIZE
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
