import type { Project } from "./data/projects";

export const SITE_URL = "https://howardw.web.app";
export const ABOUT = "Howard Wilyman (HowardW) is a Digital Media Technology student focused on gameplay programming, game design and interactive software development, with projects in Unity, C#, Android, Flutter and mixed reality.";

export function pageSeo(project?: Project | null) {
  const url = project ? `${SITE_URL}/project/${project.slug}` : `${SITE_URL}/`;
  return {
    title: project ? `${project.title} — ${project.type} | Howard Wilyman` : "Howard Wilyman (HowardW) | Gameplay & Software Developer",
    description: project ? `${project.title}: ${project.summary}` : ABOUT,
    url,
    image: `${SITE_URL}/og-preview.jpg`,
  };
}

export function structuredData(projects: Project[], project?: Project | null) {
  const seo = pageSeo(project);
  const person = {
    "@type": "Person", "@id": `${SITE_URL}/#person`,
    name: "Howard Wilyman", alternateName: "HowardW", url: `${SITE_URL}/`,
    description: ABOUT,
    sameAs: ["https://github.com/wilymanhoward", "https://www.linkedin.com/in/howard-wilyman-595833297/", "https://www.instagram.com/howardd_wilymann/"],
  };
  const work = project ? {
    "@type": "CreativeWork", "@id": `${seo.url}#work`, name: project.title,
    description: project.overview, url: seo.url, genre: project.type,
    keywords: project.tags.join(", "), contributor: { "@id": person["@id"] },
    ...(project.website ? { sameAs: project.website } : {}),
    ...(project.cover ? { image: `${SITE_URL}${project.cover}` } : {}),
  } : null;
  return {
    "@context": "https://schema.org",
    "@graph": [person,
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Howard Wilyman", alternateName: "HowardW", url: `${SITE_URL}/`, publisher: { "@id": person["@id"] } },
      { "@type": project ? "WebPage" : "ProfilePage", "@id": `${seo.url}#page`, url: seo.url,
        name: seo.title, description: seo.description, inLanguage: "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": work ? work["@id"] : person["@id"] },
      },
      ...(work ? [work, {
        "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Portfolio", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: project!.title, item: seo.url },
        ],
      }] : [{ "@type": "ItemList", name: "Howard Wilyman's projects", itemListElement: projects.map((p, i) => ({
        "@type": "ListItem", position: i + 1, name: p.title, url: `${SITE_URL}/project/${p.slug}`,
      })) }]),
    ],
  };
}
