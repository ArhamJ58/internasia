"use client";
import Link from "next/link";
import { MapPin, DollarSign, Clock } from "lucide-react";
import { Internship } from "@/lib/api";

const SOURCE_LABELS: Record<string, string> = {
  jobsdb: "JobsDB", mycareersfuture: "MyCareersFuture",
  wantedly: "Wantedly", indeed: "Indeed", direct: "Direct",
};

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function InternshipCard({ job }: { job: Internship }) {
  const isNew = Date.now() - new Date(job.scraped_at).getTime() < 24 * 60 * 60 * 1000;
  const pay = job.stipend_amount || (job.is_paid ? "Paid" : job.is_paid === false ? "Unpaid" : null);

  return (
    <Link href={`/internships/${job.id}`}>
      <div className="card card-interactive" style={{ padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 16 }}>

        {/* Company avatar */}
        <div style={{ width: 44, height: 44, borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, fontWeight: 700, color: "#2563eb" }}>
          {job.company_name.charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
            <div>
              <div style={{ fontWeight: 600, color: "#111827", fontSize: 15, lineHeight: 1.3 }}>{job.title}</div>
              <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{job.company_name}</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {isNew && <span className="badge badge-new">New</span>}
              {job.is_featured && <span className="badge badge-blue">Featured</span>}
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}>
              <MapPin size={11} /> {job.location_city ? `${job.location_city}, ` : ""}{job.location_country}
            </span>
            {pay && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: job.is_paid ? "#16a34a" : "#6b7280", fontWeight: job.is_paid ? 500 : 400 }}>
                <DollarSign size={11} /> {pay}
              </span>
            )}
            {job.industry && <span className="tag" style={{ fontSize: 11, padding: "2px 8px" }}>{job.industry}</span>}
            {job.language_required && job.language_required !== "English" && (
              <span className="tag" style={{ fontSize: 11, padding: "2px 8px" }}>{job.language_required}</span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af", marginLeft: "auto" }}>
              <Clock size={10} /> {timeAgo(job.scraped_at)} · {SOURCE_LABELS[job.source] || job.source}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
