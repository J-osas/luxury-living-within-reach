import type { Metadata } from "next";
import { SectionLabel } from "@/components/Frame";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Our Approach",
  description:
    "Why this fictional concept puts design and a readable monthly cost on the same page.",
};

export default function ApproachPage() {
  return (
    <div className="prose">
      <SectionLabel>Our approach</SectionLabel>
      <h1>Design, then the cost of living with it</h1>
      <section aria-labelledby="philosophy">
        <h2 id="philosophy">The idea</h2>
        <p>
          {site.conceptSentence} The homes are meant to feel considered: light,
          proportion, and a plan that is easy to describe. The figures are meant
          to feel equally considered. A visitor should not have to leave the
          story of a home to find the monthly picture.
        </p>
        <p>
          The people this sketch has in mind are ambitious and early in owning a
          home, or still imagining it. They can read a room. They also need the
          number next to the room to say what it is, and what it is not.
        </p>
      </section>
      <section aria-labelledby="together">
        <h2 id="together">How the three parts fit</h2>
        <p>
          Design is the architecture of the three homes: a compact starting
          point, a signature plan, and a larger elevated plan. The difference
          between them is space and use, shown with the same information.
        </p>
        <p>
          Energy is a proposed specification, written in plain words. A heat
          pump, extra insulation, or ventilation that keeps heat is a description
          of an idea. It is not a measured result, and it is not a bill.
        </p>
        <p>
          Cost is an illustration for one notional situation. The mortgage line
          follows from a stated deposit, term, and rate. The energy line is a
          round figure with its occupancy written next to it. Adding them is a
          monthly picture, not a household budget.
        </p>
      </section>
      <section id="about-this-concept" aria-labelledby="about-heading">
        <h2 id="about-heading">About this concept</h2>
        <p>
          {site.workingTitle} is a fictional public concept. It is a way to test
          whether this pairing — a beautiful home and a clear cost — is
          understandable. The homes are not offered for sale. There is no plot,
          no address, and no developer behind the pages.
        </p>
        <p>
          The working title is not a finished brand name. There is no logo.
          Imagery is a labelled frame, waiting for a later concept visualisation.
          A virtual host is not part of this sketch.
        </p>
        <p>
          If a sentence states a figure, the assumptions sit with it, and the
          costs page records what that sentence must not be taken to mean.
        </p>
      </section>
    </div>
  );
}
