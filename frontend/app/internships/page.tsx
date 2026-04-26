"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchInternships, Internship } from "@/lib/api";
import InternshipCard from "@/components/InternshipCard";

function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<Internship[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const page = Number(searchParams.get("page") || 1);
  const country = searchParams.get("country") || "";
  const industry = searchParams.get("industry") || "";
  const search = searchParams.get("search") || "";
  const paid = searchParams.get("paid") === "true";

  useEffect(() => {
    setLoading(true);
    fetchInternships({ country: country||undefined, industry: industry||undefined, search: search||undefined, paid_only: paid||undefined, page }).then((d) => {
      setJobs(d.results);
      setTotal(d.total);
      setLoading(false);
    });
  }, [country, industry, search, paid, page]);

  const COUNTRIES = ["Hong Kong","Singapore","Japan","South Korea","Taiwan"];
  const INDUSTRIES = ["Finance","Technology","Marketing","Consulting","Legal","Design","Operations","Human Resources","Research","General"];

  function setParam(key: string, val: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (val) p.set(key, val); else p.delete(key);
    p.delete("page");
    router.push(`/internships?${p.toString()}`);
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, color: "var(--text)", margin: "0 0 32px" }}>
        Browse Internships {total > 0 && <span style={{ color: "var(--text-3)", fontSize: 18 }}>({total})</span>}
      </h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <select value={country} onChange={e => setParam("country", e.target.value)} className="input" style={{ width: "auto" }}>
          <option value="">All Countries</option>
          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={industry} onChange={e => setParam("industry", e.target.value)} className="input" style={{ width: "auto" }}>
          <option value="">All Industries</option>
          {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
        </select>
        <input value={search} onChange={e => setParam("search", e.target.value)} placeholder="Search roles..." className="input" style={{ width: 200 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-2)", fontSize: 13, cursor: "pointer" }}>
          <input type="checkbox" checked={paid} onChange={e => setParam("paid", e.target.checked ? "true" : "")} />
          Paid only
        </label>
      </div>

      {loading ? (
        <div style={{ display: "grid", gap: 12 }}>
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-3)" }}>No internships found. Try adjusting your filters.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {jobs.map(job => <InternshipCard key={job.id} job={job} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 40 }}>
          {page > 1 && <button onClick={() => setParam("page", String(page-1))} className="btn-ghost">← Prev</button>}
          <span style={{ color: "var(--text-3)", fontSize: 13, alignSelf: "center" }}>Page {page} of {totalPages}</span>
          {page < totalPages && <button onClick={() => setParam("page", String(page+1))} className="btn-ghost">Next →</button>}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div style={{ padding: 40, color: "var(--text-3)" }}>Loading...</div>}><BrowsePage /></Suspense>;
}
