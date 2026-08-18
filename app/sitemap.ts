import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aswin.dev';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/experience`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tech-stack`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/testimonials`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];
}
