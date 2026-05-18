"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import Link from "next/link";

type OpsSummary = {
  periodDays: number;
  since: string;
  generatedAt: string;
  metrics: {
    events: number;
    activeEvents: number;
    bookings: number;
    noShows: number;
    checkins: number;
    ratings: number;
  };
};

type NoShowAlert = {
  id: string;
  createdAt: string;
  event: {
    name: string;
    client: {
      name: string;
    };
  };
  usher: {
    user: {
      name: string;
    };
    reliabilityScore: number;
  };
};

type ReliabilityRow = {
  usherId: string;
  user: {
    name: string;
    email: string;
  };
  rating: number;
  reliabilityScore: number;
  bookingsCount: number;
  checkinsCount: number;
};

async function fetchJson<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || "Request failed");
  return data as T;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [days, setDays] = useState(7);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState<OpsSummary | null>(null);
  const [alerts, setAlerts] = useState<NoShowAlert[]>([]);
  const [reliability, setReliability] = useState<ReliabilityRow[]>([]);

  useEffect(() => {
    async function guardAndLoad() {
      const storedToken = localStorage.getItem("ushereel_token");
      if (!storedToken) {
        router.replace("/login");
        return;
      }

      try {
        const me = await fetchJson<{ role: string }>("/api/users/me", storedToken);
        if (me.role !== "ADMIN") {
          router.replace("/account");
          return;
        }

        setToken(storedToken);
        setReady(true);
      } catch {
        localStorage.removeItem("ushereel_token");
        router.replace("/login");
      }
    }

    guardAndLoad();
  }, [router]);

  useEffect(() => {
    if (!ready || !token) return;
    loadDashboard(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  async function loadDashboard(activeToken: string) {
    setLoading(true);
    setError("");

    try {
      const [summaryData, alertsData, reliabilityData] = await Promise.all([
        fetchJson<OpsSummary>(`/api/admin/ops-summary?days=${days}`, activeToken),
        fetchJson<{ alerts: NoShowAlert[] }>(`/api/admin/no-shows?limit=${limit}`, activeToken),
        fetchJson<{ leaderboard: ReliabilityRow[] }>(`/api/admin/reliability?limit=${limit}`, activeToken),
      ]);

      setSummary(summaryData);
      setAlerts(alertsData.alerts || []);
      setReliability(reliabilityData.leaderboard || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <main className="app-shell">
        <div className="panel">
          <p className="empty-state">Checking access...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell dashboard">
      <Header />
      <header className="dashboard-header" style={{ marginBottom: '64px' }}>
        <div>
          <p className="eyebrow">Operations Management</p>
          <h1 className="page-title compact">Command Center</h1>
          <p className="lede">Real-time summaries and usher reliability metrics.</p>
        </div>
      </header>

      <section className="toolbar glass" style={{ marginBottom: '48px', padding: '32px', borderRadius: 'var(--radius-lg)' }}>
        <div className="toolbar-inner" style={{ gap: '32px' }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.65rem' }}>Time Period (Days)</label>
            <input
              type="number"
              min={1}
              max={90}
              value={days}
              onChange={(e) => setDays(Number(e.target.value || 7))}
              style={{ width: '120px' }}
            />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.65rem' }}>Result Limit</label>
            <input
              type="number"
              min={1}
              max={200}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value || 20))}
              style={{ width: '120px' }}
            />
          </div>
          <button className="button" style={{ alignSelf: 'flex-end', height: '54px' }} onClick={() => token && loadDashboard(token)} disabled={loading}>
            {loading ? "Synchronizing..." : "Refresh Intelligence"}
          </button>
        </div>
        {error ? <p className="error-box" style={{ marginTop: '24px' }}>{error}</p> : null}
      </section>

      <section className="metric-grid" style={{ marginBottom: '80px' }}>
        {summary ? (
          <>
            <MetricCard title="Total Events" value={summary.metrics.events} />
            <MetricCard title="Active Operations" value={summary.metrics.activeEvents} />
            <MetricCard title="Staff Bookings" value={summary.metrics.bookings} />
            <MetricCard title="No-Show Incidents" value={summary.metrics.noShows} variant="danger" />
            <MetricCard title="System Check-ins" value={summary.metrics.checkins} />
            <MetricCard title="Performance Ratings" value={summary.metrics.ratings} />
          </>
        ) : (
          <p className="empty-state">System data currently unavailable.</p>
        )}
      </section>

      <section className="table-section" style={{ marginBottom: '100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <h2 className="luxury-heading" style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>Critical Alerts: No-Shows</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Showing latest {alerts.length} incidents</span>
        </div>
        <div className="table-wrap glass" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <table>
            <thead>
              <tr>
                <Th>Event Profile</Th>
                <Th>Partner</Th>
                <Th>Assigned Usher</Th>
                <Th>Impact Score</Th>
                <Th>Timestamp</Th>
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 ? (
                <tr>
                  <Td colSpan={5} style={{ textAlign: 'center', padding: '64px' }}>
                    <div style={{ opacity: 0.5 }}>No critical alerts detected in this period.</div>
                  </Td>
                </tr>
              ) : (
                alerts.map((row) => (
                  <tr key={row.id}>
                    <Td><strong style={{ color: 'var(--ink)' }}>{row.event?.name || "-"}</strong></Td>
                    <Td>{row.event?.client?.name || "-"}</Td>
                    <Td>{row.usher?.user?.name || "-"}</Td>
                    <Td>
                      <span style={{ color: row.usher?.reliabilityScore < 50 ? 'var(--danger)' : 'var(--muted)' }}>
                        {row.usher?.reliabilityScore ?? "-"}%
                      </span>
                    </Td>
                    <Td suppressHydrationWarning style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                      {new Date(row.createdAt).toLocaleString()}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-section" style={{ marginBottom: '100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <h2 className="luxury-heading" style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>Performance Leaderboard</h2>
          <Link href="/admin/reliability" className="text-link" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>VIEW FULL REPORT &rarr;</Link>
        </div>
        <div className="table-wrap glass" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <table>
            <thead>
              <tr>
                <Th>Usher Identity</Th>
                <Th>Contact</Th>
                <Th>Reliability</Th>
                <Th>Avg Rating</Th>
                <Th>Bookings</Th>
                <Th>Check-ins</Th>
              </tr>
            </thead>
            <tbody>
              {reliability.length === 0 ? (
                <tr>
                  <Td colSpan={6} style={{ textAlign: 'center', padding: '64px' }}>
                    <div style={{ opacity: 0.5 }}>Reliability data is being computed...</div>
                  </Td>
                </tr>
              ) : (
                reliability.map((row) => (
                  <tr key={row.usherId}>
                    <Td><strong style={{ color: 'var(--ink)' }}>{row.user?.name || "-"}</strong></Td>
                    <Td style={{ fontSize: '0.8rem', opacity: 0.7 }}>{row.user?.email || "-"}</Td>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '4px', background: 'var(--bg-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${row.reliabilityScore}%`, height: '100%', background: 'var(--accent)' }} />
                        </div>
                        {row.reliabilityScore}%
                      </div>
                    </Td>
                    <Td>⭐ {row.rating}</Td>
                    <Td>{row.bookingsCount}</Td>
                    <Td>{row.checkinsCount}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ title, value, variant }: { title: string; value: number; variant?: "danger" }) {
  return (
    <div className="metric-card glass" style={{ 
      padding: '32px', 
      borderTop: `2px solid ${variant === "danger" ? 'var(--danger)' : 'var(--accent)'}`,
      background: 'rgba(255,255,255,0.01)'
    }}>
      <div className="metric-title" style={{ letterSpacing: '2px', fontSize: '0.65rem' }}>{title}</div>
      <div className="metric-value" style={{ 
        marginTop: '12px', 
        fontSize: '2.5rem', 
        color: variant === "danger" ? 'var(--danger)' : 'var(--ink)',
        fontWeight: 900,
        letterSpacing: '-1px'
      }}>{value}</div>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return <th style={{ padding: '20px 24px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{children}</th>;
}

function Td({ children, colSpan, suppressHydrationWarning, style }: { children: ReactNode; colSpan?: number; suppressHydrationWarning?: boolean; style?: React.CSSProperties }) {
  return <td colSpan={colSpan} suppressHydrationWarning={suppressHydrationWarning} style={{ padding: '20px 24px', ...style }}>{children}</td>;
}
