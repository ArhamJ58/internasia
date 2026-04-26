"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchInternships, Internship } from "@/lib/api";
import InternshipCard from "@/components/InternshipCard";
import { Search, SlidersHorizontal, Bell } from "lucide-react";
import Link from "next/link";

const COUNTRIES  = ["Hong Kong","Singapore","Japan","South Korea","Taiwan"];
const INDUSTRIES = ["Finance","Technology","Marketing","Consulting","Legal","Design","Operations","Human Resources","Research","General"];

function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<Internship[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page     = Number(searchParams.get("page") || 1);
  const country  = searchParams.get("country")  || "";
  const industry = searchParams.get("industry") || "";
  const search   = searchParams.get("search")   || "";
  const paid     = searchParams.get("paid") === "true";

  useEffect(() => {
    setLoading(true);
    fetchInternships({
      country: country || undefined,
      industry: industry || undefined,
      search: search || undefined,
      paid_only: paid || undefined,
      page,
    }).then(d => { setJobs(d.results); setTotal(d.total); setLoading(false); })
      .catch(() => setLoading(false));
  }, [country, industry, search, paid, page]);

  function setParam(key: string, val: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (val) p.set(key, val); else p.delete(key);
    p.delete("page");
    router.push(`/internships?${p.toString()}`);
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Internships in Asia</h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>{total > 0 ? `${total} listings found` : "Searching..."}</p>
      </div>

      {/* Search + Filters */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input
            value={search}
            onChange={e => setParam("search", e.target.value)}
            placeholder="Search roles, companies..."
            className="input"
            style={{ paddingLeft: 32 }}
          />
        </div>
        <select value={country} onChange={e => setParam("country", e.target.value)} className="input" style={{ width: "auto", minWidth: 140 }}>
          <option value="">All countries</option>
          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={industry} onChange={e => setParam("industry", e.target.value)} className="input" style={{ width: "auto", minWidth: 140 }}>
          <option value="">All industries</option>
          {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#374151", cursor: "pointer", whiteSpace: "nowrap" }}>
          <input type="checkbox" checked={paid} onChange={e => setParam("paid", e.target.checked ? "true" : "")} />
          Paid only
        </label>
        {(country || industry || search || paid) && (
          <button onClick={() => router.push("/internships")} style={{ fontSize: 13, color: "#6b7280", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
            Clear filters
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
        {/* Results */}
        <div>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontWeight: 600, color: "#111827", marginBottom: 8 }}>No results found</div>
              <div style={{ color: "#6b7280", fontSize: 14 }}>Try adjusting your filters or search terms</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {jobs.map(job => <InternshipCard key={job.id} job={job} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
              {page > 1 && <button onClick={() => setParam("page", String(page-1))} className="btn-secondary" style={{ fontSize: 13 }}>← Previous</button>}
              <span style={{ color: "#6b7280", fontSize: 13, alignSelf: "center", padding: "0 8px" }}>Page {page} of {totalPages}</span>
              {page < totalPages && <button onClick={() => setParam("page", String(page+1))} className="btn-secondary" style={{ fontSize: 13 }}>Next →</button>}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "20px" }}>
            <div style={{ fontWeight: 600, color: "#1e40af", fontSize: 14, marginBottom: 8 }}>Get alerts for these results</div>
            <p style={{ color: "#3b82f6", fontSize: 13, margin: "0 0 14px", lineHeight: 1.5 }}>We'll email you when new matching roles are posted.</p>
            <Link href={`/alerts?country=${country}&industry=${industry}`} className="btn-primary" style={{ fontSize: 13, width: "100%", justifyContent: "center" }}>
              <Bell size={13} /> Set Alert
            </Link>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "20px" }}>
            <div style={{ fontWeight: 600, color: "#111827", fontSize: 13, marginBottom: 14 }}>Filter by country</div>
            {COUNTRIES.map(c => (
              <button key={c} onClick={() => setParam("country", country === c ? "" : c)} style={{
                display: "block", width: "100%", textAlign: "left", padding: "7px 10px",
                borderRadius: 6, fontSize: 13, marginBottom: 2, cursor: "pointer",
                background: country === c ? "#eff6ff" : "transparent",
                color: country === c ? "#2563eb" : "#374151",
                border: country === c ? "1px solid #bfdbfe" : "1px solid transparent",
                fontWeight: country === c ? 600 : 400,
              }}>{c}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>Loading...</div>}><BrowsePage /></Suspense>;
}
