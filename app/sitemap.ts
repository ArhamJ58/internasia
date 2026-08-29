import type { MetadataRoute } from 'next';
import { company } from '@/lib/content';
import { items } from '@/lib/collection';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    '',
    '/collection',
    '/education',
    '/about',
    '/contact',
    ...items.map((p) => `/collection/${p.slug}`),
  ];

  return paths.map((path) => ({
    url: `${company.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
}
