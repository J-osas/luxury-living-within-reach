import type { Metadata } from "next";
import { HomeCard } from "@/components/HomeCard";
import { Disclosure, SectionLabel } from "@/components/Frame";
import { homes } from "@/content/homes";
import { workedExample } from "@/content/site";

export const metadata: Metadata = {
  title: "Homes",
  description:
    "Three fictional homes with the same information slots: bedrooms, area, and an illustrative monthly picture.",
};

export default function HomesPage() {
  return (
    <>
      <SectionLabel>Homes</SectionLabel>
      <h1>A considered range, read the same way</h1>
      <p className="lede">
        Each home has the same slots: a role, a short design idea, bedrooms,
        area, one energy feature, and an illustrative monthly picture.
      </p>
      <Disclosure>
        {workedExample.label}. {workedExample.summary} Nothing on this page is
        for sale.
      </Disclosure>
      <div className="home-list">
        {homes.map((home) => (
          <HomeCard key={home.slug} home={home} />
        ))}
      </div>
    </>
  );
}
