"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";

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
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Operations</p>
          <h1 className="page-title compact">Admin Dashboard</h1>
          <p className="lede">Monitor summaries, no-show alerts, and usher reliability.</p>
        </div>
      </header>

      <section className="toolbar panel">
        <div className="toolbar-inner">
          <label>
            Days:
            <input
              type="number"
              min={1}
              max={90}
              value={days}
              onChange={(e) => setDays(Number(e.target.value || 7))}
            />
          </label>
          <label>
            Limit:
            <input
              type="number"
              min={1}
              max={200}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value || 20))}
            />
          </label>
          <button className="button" onClick={() => token && loadDashboard(token)} disabled={loading}>
            {loading ? "Loading..." : "Refresh Dashboard"}
          </button>
        </div>
        {error ? <p className="error-box">{error}</p> : null}
      </section>

      <section className="metric-grid">
        {summary ? (
          <>
            <MetricCard title="Events" value={summary.metrics.events} />
            <MetricCard title="Active Events" value={summary.metrics.activeEvents} />
            <MetricCard title="Bookings" value={summary.metrics.bookings} />
            <MetricCard title="No-Shows" value={summary.metrics.noShows} />
            <MetricCard title="Check-ins" value={summary.metrics.checkins} />
            <MetricCard title="Ratings" value={summary.metrics.ratings} />
          </>
        ) : (
          <p className="empty-state">No data loaded.</p>
        )}
      </section>

      <section className="table-section">
        <h2 className="section-title">No-Show Alerts</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <Th>Event</Th>
                <Th>Client</Th>
                <Th>Usher</Th>
                <Th>Reliability</Th>
                <Th>Reported At</Th>
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 ? (
                <tr>
                  <Td colSpan={5}>No alerts yet.</Td>
                </tr>
              ) : (
                alerts.map((row) => (
                  <tr key={row.id}>
                    <Td>{row.event?.name || "-"}</Td>
                    <Td>{row.event?.client?.name || "-"}</Td>
                    <Td>{row.usher?.user?.name || "-"}</Td>
                    <Td>{row.usher?.reliabilityScore ?? "-"}</Td>
                    <Td suppressHydrationWarning>{new Date(row.createdAt).toLocaleString()}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-section">
        <h2 className="section-title">Reliability Leaderboard (Lowest First)</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <Th>Usher</Th>
                <Th>Email</Th>
                <Th>Reliability</Th>
                <Th>Rating</Th>
                <Th>Bookings</Th>
                <Th>Check-ins</Th>
              </tr>
            </thead>
            <tbody>
              {reliability.length === 0 ? (
                <tr>
                  <Td colSpan={6}>No reliability data yet.</Td>
                </tr>
              ) : (
                reliability.map((row) => (
                  <tr key={row.usherId}>
                    <Td>{row.user?.name || "-"}</Td>
                    <Td>{row.user?.email || "-"}</Td>
                    <Td>{row.reliabilityScore}</Td>
                    <Td>{row.rating}</Td>
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

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="metric-card">
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return <th>{children}</th>;
}

function Td({ children, colSpan }: { children: ReactNode; colSpan?: number }) {
  return <td colSpan={colSpan}>{children}</td>;
}
