import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CostPanel } from "@/components/CostPanel";
import { Disclosure, ImageFrame, SectionLabel } from "@/components/Frame";
import { getHome, homeCost, homes } from "@/content/homes";
import { formatPounds } from "@/content/money";
import { workedExample } from "@/content/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return homes.map((home) => ({ slug: home.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const home = getHome(slug);
  if (!home) {
    return { title: "Home" };
  }
  return {
    title: home.role,
    description: home.sentence,
  };
}

export default async function HomeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const home = getHome(slug);
  if (!home) {
    notFound();
  }
  const cost = homeCost(home);

  return (
    <article className="detail-layout">
      <div>
        <SectionLabel>
          {home.index} / Fictional home
        </SectionLabel>
        <h1>{home.role}</h1>
        <p className="lede">{home.sentence}</p>
        <div className="frame-sequence">
          {home.frames.map((frame) => (
            <ImageFrame
              key={frame.label}
              large={frame.label === "Street elevation"}
              index={home.index}
              label={frame.label}
              caption={frame.caption}
            />
          ))}
        </div>
        <div className="story">
          {home.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <section aria-labelledby="features-heading">
          <h2 id="features-heading">In plain words</h2>
          <ul className="feature-list">
            {home.features.map((feature) => (
              <li key={feature.name}>
                <h3>{feature.name}</h3>
                <p>{feature.plain}</p>
              </li>
            ))}
          </ul>
        </section>
        <CostPanel
          cost={cost}
          occupancy={home.occupancy}
          energyIncludes={home.energyIncludes}
        />
      </div>
      <aside className="key-facts" aria-label="Key facts">
        <SectionLabel>Key facts</SectionLabel>
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
            <dt>Illustrative monthly picture</dt>
            <dd>{formatPounds(cost.monthlyPicture)}</dd>
          </div>
        </dl>
        <Disclosure>
          Not for sale. {workedExample.label}. Last reviewed {workedExample.reviewedOn}.
        </Disclosure>
        <p>
          <Link className="text-link" href="/compare">
            Compare the three homes
          </Link>
        </p>
        <p>
          <Link className="text-link" href="/costs#monthly-picture">
            Open the assumptions
          </Link>
        </p>
      </aside>
    </article>
  );
}
