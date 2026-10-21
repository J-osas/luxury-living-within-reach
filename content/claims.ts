import { reviewedOn } from "@/content/site";

export type Claim = {
  id: string;
  title: string;
  statement: string;
  publicSafe: boolean;
  mustNotImply: string;
  lastReviewed: string;
};

export const claims: Claim[] = [
  {
    id: "fictional",
    title: "Fictional concept",
    statement:
      "Luxury Living, Within Reach is a fictional concept. The homes are not for sale, and this site is not an estate agency.",
    publicSafe: true,
    mustNotImply:
      "That a visitor can reserve, buy, or enquire to purchase a home.",
    lastReviewed: reviewedOn,
  },
  {
    id: "worked-example",
    title: "One worked example",
    statement:
      "Every figure uses one notional situation: a new home outside a major English city. The same numbers are not a price for every part of the UK.",
    publicSafe: true,
    mustNotImply: "That the illustrated prices apply nationally.",
    lastReviewed: reviewedOn,
  },
  {
    id: "purchase-figure",
    title: "Purchase figure",
    statement:
      "The purchase figure is a round design prototype so the three homes can be compared. It is not a valuation, an asking price, or an offer.",
    publicSafe: true,
    mustNotImply: "That a home is listed at this price or could be bought for it.",
    lastReviewed: reviewedOn,
  },
  {
    id: "mortgage-figure",
    title: "Mortgage illustration",
    statement:
      "The mortgage line is a repayment illustration. It takes a 10% deposit off the purchase figure and spreads the rest over 25 years at 4.5% a year. The rate is a round assumption for this sketch.",
    publicSafe: true,
    mustNotImply:
      "That a lender would offer this rate, this term, or this monthly payment.",
    lastReviewed: reviewedOn,
  },
  {
    id: "energy-figure",
    title: "Energy illustration",
    statement:
      "The energy line is a round figure chosen so the page has a shape. It is not a meter reading, a survey, or a forecast. It changes with the home's specification, how people live in it, the tariff, and the weather.",
    publicSafe: true,
    mustNotImply:
      "A guaranteed bill, a saving, or a promise that energy will cost this amount.",
    lastReviewed: reviewedOn,
  },
  {
    id: "monthly-picture",
    title: "Monthly picture",
    statement:
      "The monthly picture adds the mortgage illustration and the energy illustration. It leaves out council tax, insurance, maintenance, service charges, and furnishing.",
    publicSafe: true,
    mustNotImply: "That this total is the full cost of living in the home.",
    lastReviewed: reviewedOn,
  },
  {
    id: "imagery",
    title: "Concept images",
    statement:
      "The image frames are placeholders. They are not photographs, plans, or visualisations of homes that exist.",
    publicSafe: true,
    mustNotImply: "That the pictured home has been designed, built, or photographed.",
    lastReviewed: reviewedOn,
  },
  {
    id: "specification",
    title: "Proposed specification",
    statement:
      "Heat pumps, insulation, ventilation, and car charging are proposed features of the concept. They are not installed systems and they have not been tested.",
    publicSafe: true,
    mustNotImply:
      "A performance certificate, a measured result, or a bill that follows from the feature.",
    lastReviewed: reviewedOn,
  },
];

export function publicClaims(): Claim[] {
  return claims.filter((claim) => claim.publicSafe);
}

export function claimById(id: string): Claim {
  const claim = claims.find((item) => item.id === id);
  if (!claim) {
    throw new Error(`Unknown claim: ${id}`);
  }
  return claim;
}
