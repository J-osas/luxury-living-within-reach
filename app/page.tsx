import Link from "next/link";
import { HomeCard } from "@/components/HomeCard";
import { ImageFrame, Disclosure, SectionLabel } from "@/components/Frame";
import { homes } from "@/content/homes";
import { site, workedExample } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <SectionLabel>A fictional concept</SectionLabel>
      <h1>{site.conceptSentence}</h1>
      <div className="hero">
        <ImageFrame
          large
          index="01"
          label="The collection"
          caption="Concept visualisation. Architecture image to come."
        />
        <div>
          <p className="lede">
            {site.workingTitle} is a design-led home concept for people who want
            the rooms to feel considered, and the monthly cost to be readable.
          </p>
          <Disclosure>
            These homes are not for sale. The figures are a worked example:{" "}
            {workedExample.label}. {workedExample.summary}
          </Disclosure>
          <p>
            <Link className="text-link" href="/homes">
              See the homes
            </Link>
          </p>
        </div>
      </div>

      <section className="home-list" aria-labelledby="collection-heading">
        <div>
          <SectionLabel>The collection</SectionLabel>
          <h2 id="collection-heading">Three homes, the same information</h2>
        </div>
        {homes.map((home) => (
          <HomeCard key={home.slug} home={home} />
        ))}
      </section>

      <section className="band" aria-labelledby="costs-teaser">
        <div>
          <h2 id="costs-teaser">How costs are shown</h2>
          <p>
            Each home carries an illustrative monthly picture: a mortgage line
            plus an energy line, with the assumptions beside them. The picture is
            a design prototype. It is not an offer, a valuation, or a prediction.
          </p>
        </div>
        <p>
          <Link className="text-link" href="/costs">
            Read how a figure is built
          </Link>
        </p>
      </section>
    </>
  );
}
