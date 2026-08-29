import type { MetadataRoute } from 'next';
import { company } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ['', '/collections', '/atelier', '/heritage', '/contact'].map((path) => ({
    url: `${company.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
}
