import type { MetadataRoute } from 'next';
import { company } from '@/lib/content';
import { pieces } from '@/lib/pieces';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    '',
    '/pieces',
    '/collections',
    '/guide',
    '/atelier',
    '/heritage',
    '/contact',
    ...pieces.map((p) => `/pieces/${p.slug}`),
  ];

  return paths.map((path) => ({
    url: `${company.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
}
