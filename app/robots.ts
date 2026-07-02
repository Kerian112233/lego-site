import type {MetadataRoute} from 'next';
import {clientConfig} from '@/config/client';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {userAgent: '*', allow: '/'},
    sitemap: `${clientConfig.site.url}/sitemap.xml`
  };
}
