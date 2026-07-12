#!/usr/bin/env node
import fs from "fs";
import path from "path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://name.ehfrhfo.com";
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
`;

fs.writeFileSync(path.join(process.cwd(), "public/sitemap.xml"), xml);
console.log("Wrote name-fortune sitemap");
