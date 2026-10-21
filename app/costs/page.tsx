import type { Metadata } from "next";
import { SectionLabel } from "@/components/Frame";
import { publicClaims } from "@/content/claims";
import { workedExample } from "@/content/site";

export const metadata: Metadata = {
  title: "Costs and Energy",
  description:
    "How the illustrative mortgage and energy figures are built, and what they must not be taken to mean.",
};

export default function CostsPage() {
  const claims = publicClaims();
  return (
    <div className="prose">
      <SectionLabel>Costs and energy</SectionLabel>
      <h1>A figure is only as useful as its assumptions</h1>
      <section aria-labelledby="how-built">
        <h2 id="how-built">How a figure is built</h2>
        <p>
          Each home page shows four lines. The purchase figure is a round number
          chosen so the three roles can be compared. The mortgage illustration
          takes a {workedExample.depositRate * 100}% deposit off that number and
          spreads the rest over {workedExample.termYears} years at{" "}
          {workedExample.rateLabel}. The energy illustration is a separate round
          number for a stated number of people. The monthly picture adds those
          two lines and stops there.
        </p>
        <p>
          The rate is a round assumption for this sketch. It is not a product a
          lender is offering. The energy number was chosen so the page has a
          shape. It did not come from a meter, a model of a built house, or a
          tariff quote.
        </p>
      </section>
      <section id="worked-example" aria-labelledby="depends">
        <h2 id="depends">What it depends on</h2>
        <p>{workedExample.summary}</p>
        <p>
          An energy cost in a real home moves with the specification, how the
          household uses heat and power, the tariff, and the weather. This
          sketch holds those things still by writing them down, not by predicting
          them. Council tax, insurance, maintenance, service charges, and
          furnishing are left out so the page does not pretend to be a full
          budget.
        </p>
        <p>Last reviewed {workedExample.reviewedOn}.</p>
      </section>
      <section aria-labelledby="claims-heading">
        <h2 id="claims-heading">What you can take these sentences to mean</h2>
        <p>
          Only the statements below are shown as public claims. Each one is safe
          to read because it says what the sketch is doing, and what it refuses
          to imply.
        </p>
        {claims.map((claim) => (
          <article className="claim" id={claim.id} key={claim.id}>
            <h3>{claim.title}</h3>
            <p>{claim.statement}</p>
            <p className="must-not">
              <strong>Do not take this to mean: </strong>
              {claim.mustNotImply}
            </p>
            <p className="reviewed">Last reviewed {claim.lastReviewed}.</p>
          </article>
        ))}
      </section>
    </div>
  );
}
