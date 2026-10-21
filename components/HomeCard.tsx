import Link from "next/link";
import { homeCost, type Home } from "@/content/homes";
import { formatPounds } from "@/content/money";
import { ImageFrame } from "@/components/Frame";

export function HomeCard({ home }: { home: Home }) {
  const cost = homeCost(home);
  return (
    <article className="home-card">
      <ImageFrame
        index={home.index}
        label="Street elevation"
        caption="Concept visualisation. Architecture image to come."
      />
      <div className="home-card-body">
        <p className="section-label">
          {home.index} / {home.role}
        </p>
        <h2>
          <Link href={`/homes/${home.slug}`}>{home.role}</Link>
        </h2>
        <p>{home.sentence}</p>
        <dl className="fact-row">
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
        <p className="energy-line">{home.energyFeature}</p>
        <Link className="text-link" href={`/homes/${home.slug}`}>
          See this home
        </Link>
      </div>
    </article>
  );
}
