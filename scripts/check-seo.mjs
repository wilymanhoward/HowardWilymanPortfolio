import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert(urls.length > 1);
assert.equal(new Set(urls).size, urls.length);
const titles = new Set();
for (const url of urls) {
  const path = new URL(url).pathname;
  const html = await readFile(`dist${path === '/' ? '' : path}/index.html`, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title && !titles.has(title), `Missing or duplicate title: ${url}`);
  titles.add(title);
  assert(html.includes(`<link rel="canonical" href="${url}">`), `Canonical: ${url}`);
  assert.equal((html.match(/<h1>/g) || []).length, 1, `Heading: ${url}`);
  assert(!html.includes('<div id="root"></div>'), `Empty HTML: ${url}`);
  assert(html.includes('property="og:url" content="' + url + '"'));
  assert(html.includes('name="twitter:title"'));
  assert(!html.includes('noindex'), `Indexing blocked: ${url}`);
  const schema = JSON.parse(html.match(/<script id="page-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert(schema['@graph'].some(n => n['@type'] === 'Person'));
  if (path !== '/') {
    assert(schema['@graph'].some(n => n['@type'] === 'CreativeWork'));
    assert(schema['@graph'].some(n => n['@type'] === 'BreadcrumbList'));
    assert(html.includes('<h2>Overview</h2>'));
  }
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"#]+)"/g)) await access('dist' + asset);
}
const config = JSON.parse(await readFile('firebase.json', 'utf8'));
assert(!config.hosting.rewrites?.some(r => r.destination === '/index.html'), 'Unknown routes must not return homepage HTML');
assert((await readFile('dist/404.html', 'utf8')).includes('noindex'));
assert((await readFile('dist/robots.txt', 'utf8')).includes('Sitemap: https://howardw.web.app/sitemap.xml'));
console.log(`SEO checks passed for ${urls.length} URLs: static content, unique titles, canonicals, social tags, schema, assets, sitemap and 404.`);
