import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { projects } = await server.ssrLoadModule('/src/data/projects.ts');
  const { certificates } = await server.ssrLoadModule('/src/data/certificates.ts');
  const { pageSeo, structuredData, ABOUT, SITE_URL, CERTIFICATES_SEO } = await server.ssrLoadModule('/src/seo.ts');
  const template = await readFile('dist/index.html', 'utf8');
  const escape = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const list = (items = []) => `<ul>${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`;
  const projectContent = (p) => `<h1>${escape(p.title)}</h1><p>${escape(p.type)}</p>
    <dl>${[['Role', p.role], ['Date', p.date], ['Team', p.team]].filter(([,v]) => v).map(([k,v]) => `<dt>${k}</dt><dd>${escape(v)}</dd>`).join('')}</dl>
    <p>Tools: ${escape(p.tags.join(', '))}</p>
    ${p.website ? `<p><a href="${escape(p.website)}">Open website</a></p>` : p.github ? `<p><a href="${escape(p.github)}">View on GitHub</a></p>` : ''}
    <h2>Overview</h2>${p.overview.split(/\n\s*\n/).map(t => `<p>${escape(t)}</p>`).join('')}
    ${p.features?.length ? `<h2>${escape(p.featuresTitle ?? 'Key features')}</h2>${list(p.features)}` : ''}
    ${p.highlights.length ? `<h2>What I did</h2>${list(p.highlights)}` : ''}
    ${p.award ? `<h2>Award</h2><p>${escape(p.award.title)} — ${escape(p.award.detail)}</p>` : ''}
    ${p.credits?.length ? `<h2>Credits</h2>${list(p.credits)}` : ''}
    ${p.media.map(m => m.type === 'image' ? `<img src="${escape(m.src)}" alt="${escape(m.alt)}" loading="lazy">` : `<video controls preload="none" src="${escape(m.src)}"${m.poster ? ` poster="${escape(m.poster)}"` : ''}></video>`).join('')}`;
  const links = projects.map(p => `<li><a href="/project/${p.slug}">${escape(p.title)}</a> — ${escape(p.summary)}</li>`).join('');
  const home = `<h1>Howard Wilyman — Gameplay &amp; Software Developer</h1><section id="about"><h2>About me</h2><p>${escape(ABOUT)}</p></section><section id="work"><h2>Project Gallery</h2><ul>${links}</ul></section><section id="contact"><h2>Contact</h2><a href="mailto:wilymanhoward@gmail.com">wilymanhoward@gmail.com</a><p><a href="https://github.com/wilymanhoward">GitHub</a> · <a href="https://www.linkedin.com/in/howard-wilyman-595833297/">LinkedIn</a> · <a href="/Howard_Wilyman_Resume.pdf">Resume (PDF)</a> · <a href="/certificates">Certificates</a></p></section>`;
  const certificatesContent = `<h1>Certificates</h1>${certificates.map(c => `<figure><img src="${escape(c.image)}" alt="${escape(c.alt)}" loading="lazy"><figcaption><h2>${escape(c.title)}</h2><p>${escape(c.kind)} · ${escape(c.issuer)} · ${escape(c.date)}</p></figcaption></figure>`).join('')}`;
  const certificatesSchema = { '@context': 'https://schema.org', '@graph': [structuredData(projects)['@graph'][0], {
    '@type': 'CollectionPage', '@id': `${CERTIFICATES_SEO.url}#page`, url: CERTIFICATES_SEO.url, name: CERTIFICATES_SEO.title,
    description: CERTIFICATES_SEO.description, inLanguage: 'en', isPartOf: { '@id': `${SITE_URL}/#website` },
  }] };
  const pages = [
    ...[undefined, ...projects].map(project => ({ seo: pageSeo(project), schema: structuredData(projects, project),
      content: project ? projectContent(project) : home, directory: project ? `dist/project/${project.slug}` : 'dist' })),
    { seo: CERTIFICATES_SEO, schema: certificatesSchema, content: certificatesContent, directory: 'dist/certificates' },
  ];
  for (const { seo, schema, content, directory } of pages) {
    let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(seo.title)}</title>`)
      .replace(/<meta\b[^>]*\b(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[^>]*>/g, '')
      .replace(/<link rel="canonical"[^>]*>/g, '')
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
    const tags = `<meta name="description" content="${escape(seo.description)}"><link rel="canonical" href="${seo.url}">
      ${Object.entries({ 'og:type': 'website', 'og:site_name': 'Howard Wilyman', 'og:title': seo.title, 'og:description': seo.description, 'og:url': seo.url, 'og:image': seo.image, 'og:image:width': '1200', 'og:image:height': '630', 'og:image:alt': 'Howard Wilyman — Gameplay Programmer and Developer' }).map(([k,v]) => `<meta property="${k}" content="${escape(v)}">`).join('')}
      <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(seo.title)}"><meta name="twitter:description" content="${escape(seo.description)}"><meta name="twitter:image" content="${seo.image}">
      <script id="page-schema" type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
      <style>.seo-page{position:fixed;inset:0;overflow-y:auto;max-width:1000px;margin:0 auto;padding:32px 24px;color:#eae5ec;background:#0b090d;font:17px/1.65 system-ui}.seo-page a{color:#9dc4ff}.seo-page img,.seo-page video{max-width:100%}.seo-page h1{line-height:1.2}.seo-page dd{margin-bottom:12px}</style>`;
    html = html.replace('</head>', `${tags}</head>`).replace('<div id="root"></div>', `<div id="root"><div class="seo-page"><nav><a href="/">Howard Wilyman — Portfolio</a></nav><main>${content}</main></div></div>`);
    await mkdir(directory, { recursive: true });
    await writeFile(`${directory}/index.html`, html);
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', ...projects.map(p => `/project/${p.slug}`), '/certificates'].map(path => `<url><loc>${SITE_URL}${path}</loc></url>`).join('')}</urlset>`;
  await writeFile('dist/sitemap.xml', sitemap);
  await writeFile('public/sitemap.xml', sitemap);
  console.log(`Generated homepage, ${projects.length} project pages, certificates page, sitemap and 404 page.`);
} finally {
  await server.close();
}
