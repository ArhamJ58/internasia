import { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://internasia.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                    lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE_URL}/internships`,   lastModified: new Date(), changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE_URL}/alerts`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/resources`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/advertise`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/post-job`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    // Pull all active internship IDs for individual listing pages
    const res = await fetch(`${API_URL}/internships?limit=100&page=1`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const listingRoutes: MetadataRoute.Sitemap = (data.results || []).map((job: { id: string; scraped_at: string }) => ({
        url: `${BASE_URL}/internships/${job.id}`,
        lastModified: new Date(job.scraped_at),
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));
      return [...staticRoutes, ...listingRoutes];
    }
  } catch {
    // Return static routes if API is down
  }

  return staticRoutes;
}
