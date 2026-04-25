"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RefreshCw, CheckCircle2, XCircle, Clock, Zap, BellRing, MousePointerClick, Activity, TrendingUp } from "lucide-react";

interface ScraperRun {
  id: string; source: string; started_at: string; finished_at: string | null;
  listings_found: number; listings_new: number; status: "running" | "success" | "error"; error_message: string | null;
}
interface AdminStats {
  confirmed_alerts: number; pending_confirmation: number;
  total_notifications_sent: number; affiliate_clicks: Record<string, number>;
}

const SOURCE_COLORS: Record<string, string> = {
  jobsdb: "#3b82f6", mycareersfuture: "#22c55e", wantedly: "#a855f7", indeed: "#f97316",
};

export default function AdminPage() {
  const [runs, setRuns] = useState<ScraperRun[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [r, s] = await Promise.all([api.get("/admin/scraper-runs?limit=40"), api.get("/admin/stats")]);
      setRuns(r.data); setStats(s.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const triggerScrape = async (source?: string) => {
    const key = source || "all"; setTriggering(key);
    try { await api.post(`/admin/trigger-scrape${source ? `?source=${source}` : ""}`); setTimeout(load, 3000); }
    catch (e) { console.error(e); } finally { setTriggering(null); }
  };

  const dur = (start: string, end: string | null) => {
    if (!end) return "···";
    const s = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000);
    return s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;
  };

  const totalClicks = stats ? Object.values(stats.affiliate_clicks).reduce((a,b) => a+b, 0) : 0;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <p className="label-overline" style={{ marginBottom: 8 }}>System</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.01em' }}>
            Admin Dashboard
          </h1>
        </div>
        <button onClick={load} className="btn-ghost" style={{ gap: 8 }}>
          <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Stats grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: "Active Alerts", value: stats.confirmed_alerts, icon: <BellRing size={16} color="var(--gold)" />, suffix: "" },
            { label: "Pending Confirm", value: stats.pending_confirmation, icon: <Clock size={16} color="#f97316" />, suffix: "" },
            { label: "Emails Sent", value: stats.total_notifications_sent, icon: <Zap size={16} color="#22c55e" />, suffix: "" },
            { label: "Affiliate Clicks", value: totalClicks, icon: <MousePointerClick size={16} color="#a855f7" />, suffix: "" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '24px 24px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                {s.icon}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
                {s.value?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Affiliate breakdown + scrape triggers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>

        {/* Affiliate */}
        {stats && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <TrendingUp size={14} color="var(--gold)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Affiliate Clicks</span>
            </div>
            {Object.keys(stats.affiliate_clicks).length === 0
              ? <p style={{ color: 'var(--text-3)', fontSize: 13 }}>No clicks yet.</p>
              : Object.entries(stats.affiliate_clicks).sort(([,a],[,b]) => b-a).map(([name, count]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: Math.max(4, (count / totalClicks) * 120), height: 4, borderRadius: 2, background: 'var(--gold)', opacity: 0.7 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)', textTransform: 'capitalize' }}>{name}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>{count}</span>
                </div>
              ))
            }
          </div>
        )}

        {/* Scrape triggers */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Activity size={14} color="var(--gold)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Manual Trigger</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {["all", "jobsdb", "mycareersfuture", "wantedly", "indeed"].map(src => (
              <button key={src}
                onClick={() => triggerScrape(src === "all" ? undefined : src)}
                disabled={triggering === src}
                className="btn-ghost"
                style={{
                  fontSize: 12, padding: '7px 14px', gap: 6,
                  borderColor: src === "all" ? 'var(--border-hi)' : `${SOURCE_COLORS[src]}40`,
                  color: src === "all" ? 'var(--text-2)' : SOURCE_COLORS[src],
                  opacity: triggering === src ? 0.5 : 1,
                }}
              >
                {triggering === src
                  ? <RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} />
                  : <Zap size={11} />
                }
                {src === "all" ? "Run All" : src}
              </button>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', margin: '16px 0 0' }}>
            Triggers run in background. Refresh in ~30s to see results.
          </p>
        </div>
      </div>

      {/* Scraper log */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={13} color="var(--gold)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Scraper Run Log</span>
        </div>

        {loading ? (
          <div style={{ padding: 32 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8, borderRadius: 6 }} />
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {["Source", "Started", "Duration", "Found", "New", "Status"].map(h => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', color: 'var(--text-3)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {runs.map((run, i) => (
                  <tr key={run.id} style={{ borderBottom: '1px solid rgba(30,45,69,0.5)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: `${SOURCE_COLORS[run.source]}15`,
                        border: `1px solid ${SOURCE_COLORS[run.source]}30`,
                        color: SOURCE_COLORS[run.source],
                        padding: '3px 8px', borderRadius: 4, fontSize: 11,
                      }}>{run.source}</span>
                    </td>
                    <td style={{ padding: '12px 20px', color: 'var(--text-3)', fontSize: 11 }}>
                      {new Date(run.started_at).toLocaleString("en-HK", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td style={{ padding: '12px 20px', color: 'var(--text-2)' }}>{dur(run.started_at, run.finished_at)}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--text)', fontWeight: 600 }}>{run.listings_found}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ color: run.listings_new > 0 ? '#4ade80' : 'var(--text-3)', fontWeight: 600 }}>+{run.listings_new}</span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      {run.status === "success" && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#4ade80' }}>
                          <CheckCircle2 size={12} /> Success
                        </span>
                      )}
                      {run.status === "error" && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#f87171' }} title={run.error_message || ""}>
                          <XCircle size={12} /> Error
                        </span>
                      )}
                      {run.status === "running" && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#fbbf24' }}>
                          <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Running
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
