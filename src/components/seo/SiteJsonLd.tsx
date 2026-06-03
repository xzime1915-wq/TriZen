import { JsonLd } from "./JsonLd";
import {
  SITE_CONTACT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAV_LINKS,
  SITE_SOCIAL,
  SITE_URL,
} from "@/lib/site-config";

export function SiteJsonLd() {
  const orgId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.png`,
      image: `${SITE_URL}/og-image.png`,
      email: SITE_CONTACT.email,
      telephone: SITE_CONTACT.phone,
      sameAs: [...SITE_SOCIAL],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": orgId },
      inLanguage: "en-BD",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Store",
      "@id": `${SITE_URL}/#store`,
      name: SITE_NAME,
      url: SITE_URL,
      image: `${SITE_URL}/icon.png`,
      telephone: SITE_CONTACT.phone,
      email: SITE_CONTACT.email,
      priceRange: "৳৳",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BD",
      },
      parentOrganization: { "@id": orgId },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#sitenav`,
      name: `${SITE_NAME} — main pages`,
      itemListElement: SITE_NAV_LINKS.map((link, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: link.name,
        item: link.url,
      })),
    },
  ];

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}
