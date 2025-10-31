import { useEffect } from "react";
import { siteConfig } from "../config/siteConfig";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title,
  description = siteConfig.description,
  image = "/assets/og-image.jpg",
  url = window.location.href,
  type = "website",
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${siteConfig.companyName}`
    : `${siteConfig.companyName} - ${siteConfig.tagline}`;

  useEffect(() => {
    document.title = fullTitle;

    // Update meta tags
    updateMetaTag("description", description);
    updateMetaTag("og:title", fullTitle, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", image, "property");
    updateMetaTag("og:url", url, "property");
    updateMetaTag("og:type", type, "property");
    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", fullTitle, "name");
    updateMetaTag("twitter:description", description, "name");
    updateMetaTag("twitter:image", image, "name");
  }, [fullTitle, description, image, url, type]);

  return null;
}

function updateMetaTag(key: string, content: string, attribute: string = "name") {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}
