"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchInternships, fetchFilters, Internship, Filters } from "@/lib/api";
import InternshipCard from "@/components/InternshipCard";
import FilterSidebar from "@/components/FilterSidebar";
import AffiliateBanner from "@/components/ads/AffiliateBanner";
import AdSense from "@/components/ads/AdSense";
import { Loader2, SearchX, BellRing, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export default function InternshipsPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [internships,    setInternships]    = useState<Internship[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [total,          setTotal]          = useState(0);
  const [filterOptions,  setFilterOptions]  = useState({ countries: [] as string[], industries: [] as string[], languages: [] as string[] });
  const [drawerOpen,     setDrawerOpen]     = useState(false);
  const [isMobile,       setIsMobile]       = useState(false);

  const [filters, setFilters] = useState<Filters>({
    country:             searchParams.get("country")             || undefined,
    industry:            searchParams.get("industry")            || undefined,
    language:            searchParams.get("language")            || undefined,
    search:              searchParams.get("search")              || undefined,
    paid_only:           searchParams.get("paid_only") === "true" || undefined,
    posted_within_hours: searchParams.get("posted_within_hours") ? Number(searchParams.get("posted_within_hours")) : undefined,
    page:                Number(searchParams.get("page") || 1),
    limit:               20,
  });

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Sync filters → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.country)             params.set("country", filters.country);
    if (filters.industry)            params.set("industry", filters.industry);
    if (filters.language)            params.set("language", filters.language);
    if (filters.search)              params.set("search", filters.search);
    if (filters.paid_only)           params.set("paid_only", "true");
    if (filters.posted_within_hours) params.set("posted_within_hours", String(filters.posted_within_hours));
    if (filters.page && filters.page > 1) params.set("page", String(filters.page));
    router.replace(`/internships?${params.toString()}`, { scroll: false });
  }, [filters]); // eslint-disable-line

  useEffect(() => {
    fetchFilters().then(setFilterOptions).catch(console.error);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInternships(filters);
      setInternships(data.results);
      setTotal(data.total ?? data.count);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const page       = filters.page || 1;
  const totalPages = Math.ceil(total / 20);
  const first10    = internships.slice(0, 10);
  const rest       = internships.slice(10);

  const hasFilters = filters.country || filters.industry || filters.language ||
    filters.paid_only || filters.search || filters.posted_within_hours;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "28px 16px" : "40px 24px" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <p className="label-overline" style={{ marginBottom: 8 }}>Live listings</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.1 }}>
            Browse Internships
          </h1>
          <p style={{ color: "var(--text-3)", fontSize: 12, margin: "8px 0 0", fontFamily: "var(--font-mono)" }}>
            Scraped every 6h · JobsDB · MyCareersFuture · Wantedly · Indeed
          </p>
        </div>
        <Link href="/alerts" className="btn-outline-gold" style={{ fontSize: 13 }}>
          <BellRing size={13} /> Alert me
        </Link>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* Desktop sidebar */}
        {!isMobile && (
          <FilterSidebar filters={filters} onChange={setFilters} options={filterOptions} />
        )}

        {/* Main column */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Mobile: filter bar */}
          {isMobile && (
            <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
              <button
                onClick={() => setDrawerOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: hasFilters ? "rgba(240,180,41,0.1)" : "var(--surface)",
                  border: `1px solid ${hasFilters ? "var(--gold-dim)" : "var(--border)"}`,
                  borderRadius: 8, padding: "9px 14px", cursor: "pointer",
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  color: hasFilters ? "var(--gold)" : "var(--text-2)",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                }}
              >
                <SlidersHorizontal size={13} />
                Filters {hasFilters && "●"}
              </button>
              {/* Active filter pills */}
              {filters.country && (
                <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: "rgba(240,180,41,0.08)", color: "var(--gold)", border: "1px solid rgba(240,180,41,0.2)" }}>
                  {filters.country}
                </span>
              )}
              {filters.industry && (
                <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: "rgba(240,180,41,0.08)", color: "var(--gold)", border: "1px solid rgba(240,180,41,0.2)" }}>
                  {filters.industry}
                </span>
              )}
            </div>
          )}

          {/* Mobile filter drawer */}
          {isMobile && drawerOpen && (
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              options={filterOptions}
              asDrawer
              onClose={() => setDrawerOpen(false)}
            />
          )}

          {/* Result bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)", margin: 0 }}>
              {loading ? "···" : `${total.toLocaleString()} results`}
              {filters.country && <span style={{ color: "var(--gold)", marginLeft: 6 }}>· {filters.country}</span>}
            </p>
            <div style={{ display: "flex", gap: 6 }}>
              {([
                { label: "All time", val: undefined },
                { label: "24h", val: 24 },
                { label: "1w",  val: 168 },
              ] as const).map(opt => {
                const active = filters.posted_within_hours === opt.val;
                return (
                  <button key={opt.label}
                    onClick={() => setFilters(f => ({ ...f, posted_within_hours: opt.val, page: 1 }))}
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: 11,
                      padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                      border: `1px solid ${active ? "rgba(240,180,41,0.3)" : "var(--border)"}`,
                      background: active ? "rgba(240,180,41,0.08)" : "transparent",
                      color: active ? "var(--gold)" : "var(--text-3)",
                      transition: "all 0.15s",
                    }}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <Loader2 size={28} color="var(--text-3)" className="spin" />
            </div>
          )}

          {/* Empty */}
          {!loading && internships.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <SearchX size={40} color="var(--text-3)" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "var(--text-2)", fontSize: 16, fontFamily: "var(--font-display)", marginBottom: 8 }}>No results found.</p>
              <p style={{ color: "var(--text-3)", fontSize: 13, marginBottom: 24 }}>Try adjusting your filters or check back after the next scrape.</p>
              <button onClick={() => setFilters({ page: 1, limit: 20 })} className="btn-outline-gold" style={{ fontSize: 13 }}>
                Clear all filters
              </button>
            </div>
          )}

          {/* Listings grid */}
          {!loading && internships.length > 0 && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {first10.map(job => <InternshipCard key={job.id} job={job} />)}
              </div>

              {/* Mid-list affiliate banner */}
              {first10.length > 0 && rest.length > 0 && (
                <div style={{ margin: "16px 0" }}>
                  <AffiliateBanner context="browse" />
                </div>
              )}

              {rest.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {rest.map(job => <InternshipCard key={job.id} job={job} />)}
                </div>
              )}

              {/* AdSense between pages */}
              <div style={{ margin: "16px 0" }}>
                <AdSense slot="5566778899" format="horizontal" />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 32, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}
                    disabled={page <= 1}
                    className="btn-outline-gold"
                    style={{ fontSize: 13, padding: "8px 14px", opacity: page <= 1 ? 0.4 : 1 }}
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button key={p}
                        onClick={() => setFilters(f => ({ ...f, page: p }))}
                        style={{
                          fontFamily: "var(--font-mono)", fontSize: 12,
                          width: 36, height: 36, borderRadius: 8,
                          border: `1px solid ${page === p ? "var(--gold-dim)" : "var(--border)"}`,
                          background: page === p ? "rgba(240,180,41,0.1)" : "transparent",
                          color: page === p ? "var(--gold)" : "var(--text-3)",
                          cursor: "pointer",
                        }}
                      >{p}</button>
                    );
                  })}

                  {totalPages > 7 && <span style={{ color: "var(--text-3)", fontSize: 12 }}>… {totalPages}</span>}

                  <button
                    onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
                    disabled={page >= totalPages}
                    className="btn-outline-gold"
                    style={{ fontSize: 13, padding: "8px 14px", opacity: page >= totalPages ? 0.4 : 1 }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Desktop right sidebar ads */}
        {!isMobile && (
          <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <AffiliateBanner context="sidebar" />
            <AdSense slot="5566778899" format="vertical" />
          </div>
        )}
      </div>
    </div>
  );
}
