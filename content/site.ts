export const reviewedOn = "21 October 2026";

export const site = {
  workingTitle: "Luxury Living, Within Reach",
  conceptSentence:
    "A better-looking home life, with a clearer picture of what it costs.",
  description:
    "A fictional UK concept for design-led homes, shown with an illustrative monthly picture of owning and running one.",
  nav: [
    { href: "/homes", label: "Homes" },
    { href: "/compare", label: "Compare" },
    { href: "/approach", label: "Our Approach" },
    { href: "/costs", label: "Costs and Energy" },
    { href: "/feedback", label: "Feedback" },
  ],
  aboutHref: "/approach#about-this-concept",
} as const;

export const workedExample = {
  label: "One notional town in England",
  summary:
    "A single worked example for a new home outside a major English city. It is one situation for this sketch. It is not an address, a development, or a price for the whole UK.",
  depositRate: 0.1,
  termYears: 25,
  annualRate: 0.045,
  rateLabel: "4.5% a year",
  reviewedOn,
} as const;
