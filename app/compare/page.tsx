import type { Metadata } from "next";
import Link from "next/link";
import { Disclosure, SectionLabel } from "@/components/Frame";
import { homeCost, homes } from "@/content/homes";
import { formatPounds } from "@/content/money";
import { workedExample } from "@/content/site";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "The three fictional homes side by side, with the same illustrative cost slots.",
};

export default function ComparePage() {
  return (
    <>
      <SectionLabel>Compare</SectionLabel>
      <h1>The same slots, three homes</h1>
      <p className="lede">
        Bedrooms, area, the purchase figure, and the monthly picture use one
        structure. On a phone, the homes stack. Nothing here is a filter or a
        search.
      </p>
      <Disclosure>
        {workedExample.label}. Deposit {workedExample.depositRate * 100}%,{" "}
        {workedExample.termYears} years, {workedExample.rateLabel}. Energy lines
        are round sketch figures, not forecasts.
      </Disclosure>
      <div className="compare-grid">
        {homes.map((home) => {
          const cost = homeCost(home);
          return (
            <article className="compare-card" key={home.slug}>
              <p className="section-label">{home.index}</p>
              <h2>
                <Link href={`/homes/${home.slug}`}>{home.role}</Link>
              </h2>
              <p>{home.sentence}</p>
              <dl>
                <div>
                  <dt>Bedrooms</dt>
                  <dd>{home.bedrooms}</dd>
                </div>
                <div>
                  <dt>Area</dt>
                  <dd>{home.areaSqm} m²</dd>
                </div>
                <div>
                  <dt>Purchase figure</dt>
                  <dd>{formatPounds(cost.purchasePrice)}</dd>
                </div>
                <div>
                  <dt>Mortgage illustration</dt>
                  <dd>{formatPounds(cost.mortgageMonthly)}</dd>
                </div>
                <div>
                  <dt>Energy illustration</dt>
                  <dd>{formatPounds(cost.energyMonthly)}</dd>
                </div>
                <div>
                  <dt>Monthly picture</dt>
                  <dd>{formatPounds(cost.monthlyPicture)}</dd>
                </div>
              </dl>
              <p>{home.energyFeature}</p>
              <Link className="text-link" href={`/homes/${home.slug}#cost-panel-title`}>
                Read the assumptions
              </Link>
            </article>
          );
        })}
      </div>
    </>
  );
}
