import Link from "next/link";
import type { CostPicture } from "@/content/money";
import { formatPounds } from "@/content/money";
import { workedExample } from "@/content/site";

export function CostPanel({
  cost,
  occupancy,
  energyIncludes,
}: {
  cost: CostPicture;
  occupancy: string;
  energyIncludes: string;
}) {
  return (
    <section className="cost-panel" aria-labelledby="cost-panel-title">
      <p className="section-label">Inside the home story</p>
      <h2 id="cost-panel-title">What this might cost, as a sketch</h2>
      <p className="cost-total">
        <span className="cost-total-figure">{formatPounds(cost.monthlyPicture)}</span>
        <span>illustrative monthly picture</span>
      </p>
      <dl className="ledger">
        <div>
          <dt>
            <Link href="/costs#purchase-figure">Purchase figure</Link>
          </dt>
          <dd>{formatPounds(cost.purchasePrice)}</dd>
          <dd className="ledger-note">
            A round prototype for this home. Not a valuation or an asking price.
          </dd>
        </div>
        <div>
          <dt>
            <Link href="/costs#mortgage-figure">Mortgage illustration</Link>
          </dt>
          <dd>{formatPounds(cost.mortgageMonthly)} a month</dd>
          <dd className="ledger-note">
            {formatPounds(cost.deposit)} deposit (10%). {formatPounds(cost.borrowed)}{" "}
            illustrated as borrowed. {workedExample.termYears} years at{" "}
            {workedExample.rateLabel}. Not a mortgage offer.
          </dd>
        </div>
        <div>
          <dt>
            <Link href="/costs#energy-figure">Energy illustration</Link>
          </dt>
          <dd>{formatPounds(cost.energyMonthly)} a month</dd>
          <dd className="ledger-note">
            {occupancy}. {energyIncludes} Not a forecast or a guarantee.
          </dd>
        </div>
        <div>
          <dt>
            <Link href="/costs#monthly-picture">Monthly picture</Link>
          </dt>
          <dd>{formatPounds(cost.monthlyPicture)} a month</dd>
          <dd className="ledger-note">
            Mortgage illustration plus energy illustration. Council tax, insurance,
            maintenance, and furnishing are not included.
          </dd>
        </div>
      </dl>
      <p className="reviewed">
        Illustrative. These homes are not for sale. Last reviewed{" "}
        {workedExample.reviewedOn}.{" "}
        <Link href="/costs#worked-example">How these figures are built</Link>
      </p>
    </section>
  );
}
