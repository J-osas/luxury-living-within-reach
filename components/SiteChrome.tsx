import Link from "next/link";
import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-identity">
        <Link className="wordmark" href="/">
          {site.workingTitle}
        </Link>
        <p>Working title. A fictional concept.</p>
      </div>
      <nav aria-label="Primary">
        <ul>
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <Link className="about-link" href={site.aboutHref}>
        About this concept
      </Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        {site.workingTitle} is a fictional concept. The homes are not for sale.
        Figures are illustrative prototypes for one notional situation, last
        reviewed 21 October 2026. They are not offers, valuations, or predictions.
      </p>
      <ul>
        <li>
          <Link href="/costs">How costs are shown</Link>
        </li>
        <li>
          <Link href="/approach#about-this-concept">About this concept</Link>
        </li>
        <li>
          <Link href="/feedback">Give feedback</Link>
        </li>
      </ul>
    </footer>
  );
}
