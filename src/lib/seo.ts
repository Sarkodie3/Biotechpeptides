export const CANONICAL_DOMAIN = 'https://biotechpeptidesonline.com';
export const SITE_NAME = 'Biotech Peptides';
export const DEFAULT_OG_IMAGE = `${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`;

export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Ensure trailing slash matching Next.js configuration
  const withTrailing = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  return `${CANONICAL_DOMAIN}${withTrailing === '//' ? '/' : withTrailing}`;
}

export function cleanText(html: string = ''): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '—')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${CANONICAL_DOMAIN}/#organization`,
    name: SITE_NAME,
    url: CANONICAL_DOMAIN,
    logo: {
      '@type': 'ImageObject',
      url: `${CANONICAL_DOMAIN}/wp-content/uploads/2021/04/biotech-peptides-logo-300x74.png`,
      width: 300,
      height: 74,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+3122862032',
      contactType: 'customer support',
      email: 'Biotechpeptidessupport@gmail.com',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://twitter.com/biotechpeptides',
      'https://www.facebook.com/biotechpeptides',
    ],
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${CANONICAL_DOMAIN}/#website`,
    url: CANONICAL_DOMAIN,
    name: SITE_NAME,
    description: 'High-Purity Lyophilized Research Peptides Synthesized in the USA',
    publisher: {
      '@id': `${CANONICAL_DOMAIN}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${CANONICAL_DOMAIN}/?s={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${CANONICAL_DOMAIN}${item.url}`,
    })),
  };
}
