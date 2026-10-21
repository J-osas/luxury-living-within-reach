import { costPicture, type CostPicture } from "@/content/money";

export type HomeFeature = {
  name: string;
  plain: string;
};

export type HomeFrame = {
  label: string;
  caption: string;
};

export type Home = {
  slug: string;
  index: string;
  role: string;
  bedrooms: number;
  areaSqm: number;
  sentence: string;
  story: string[];
  features: HomeFeature[];
  frames: HomeFrame[];
  purchasePrice: number;
  occupancy: string;
  energyMonthly: number;
  energyIncludes: string;
  energyFeature: string;
};

const frames = (role: string): HomeFrame[] => [
  {
    label: "Street elevation",
    caption: `${role}. Concept visualisation. Architecture image to come.`,
  },
  {
    label: "Material study",
    caption: "Concept visualisation. Architecture image to come.",
  },
  {
    label: "Plan, not to scale",
    caption: "A drawing slot for a later concept plan. Not a measured survey.",
  },
];

export const homes: Home[] = [
  {
    slug: "considered",
    index: "01",
    role: "Considered Starting Point",
    bedrooms: 2,
    areaSqm: 74,
    sentence:
      "A compact plan where one long room of light, and storage in the walls, do the work of a larger house.",
    story: [
      "This is the smallest home in the collection. The plan spends its area on one living room with a long window, a kitchen that shares that light, and two bedrooms set away from it.",
      "The rooms stay clear because storage is built into the depth of the walls. Outside, there is a small court rather than a garden to look after.",
      "The heat pump and the insulation are proposals. They are here so a visitor can read what the home is imagined to include. They are not a promise about a bill.",
    ],
    features: [
      {
        name: "One living room, two bedrooms",
        plain:
          "Daylight is concentrated in the room where people spend the day. The bedrooms stay smaller and quieter.",
      },
      {
        name: "Storage in the walls",
        plain:
          "Cupboards take thickness from the plan instead of standing in the room. The square metres quoted are the rooms, not the cupboards.",
      },
      {
        name: "A heat pump, proposed",
        plain:
          "Heating would use electricity rather than a gas boiler. What that costs still depends on the tariff and how much heat the household uses.",
      },
      {
        name: "A small court",
        plain:
          "One outdoor room, planted simply. It is part of the design idea, not a claim about maintenance costs.",
      },
    ],
    frames: frames("Considered Starting Point"),
    purchasePrice: 275_000,
    occupancy: "Two people",
    energyMonthly: 85,
    energyIncludes:
      "A round allowance for heating, hot water, and ordinary electricity for two people. It does not include charging a car.",
    energyFeature: "Heat pump and extra insulation, described in plain words",
  },
  {
    slug: "signature",
    index: "02",
    role: "Signature",
    bedrooms: 3,
    areaSqm: 108,
    sentence:
      "The home that should make the idea easiest to read: room for work, rest, and a table, with the monthly picture in the same flow.",
    story: [
      "The Signature home is the middle of the collection. There is a room that can close for work, a kitchen facing a court, and space for a table when people come over.",
      "Its cost panel uses the same lines as the smaller and larger homes. The difference should be the home, not a different way of dressing the numbers.",
      "Ventilation that keeps some of the heat from outgoing air is a proposed feature. The page names it in ordinary language, with the technical term beside it.",
    ],
    features: [
      {
        name: "A room that can close",
        plain:
          "Work can leave the living room. The door is the point: the rest of the home can stay for living.",
      },
      {
        name: "Kitchen toward the court",
        plain:
          "Cooking, eating, and the outdoor room share one side of the plan. The bedrooms are on the other.",
      },
      {
        name: "Ventilation that keeps heat",
        plain:
          "Fresh air comes in, and some warmth from the air going out is held back. This is often called MVHR. It is a proposal, not a tested installation.",
      },
      {
        name: "A point for charging a car",
        plain:
          "The sketch includes a charger. Using it adds to the electricity a household buys. That use is not inside the energy line below.",
      },
    ],
    frames: frames("Signature"),
    purchasePrice: 425_000,
    occupancy: "Three people",
    energyMonthly: 110,
    energyIncludes:
      "A round allowance for heating, hot water, and ordinary electricity for three people. Charging a car is extra, and is not in this line.",
    energyFeature: "Heat pump, heat-recovery ventilation, and a car charger",
  },
  {
    slug: "elevated",
    index: "03",
    role: "Elevated",
    bedrooms: 4,
    areaSqm: 156,
    sentence:
      "More room and a taller living space, held to the same standard of explanation. The extra space is shown as extra cost.",
    story: [
      "The Elevated home is the most spacious of the three. The living room is taller than the others, and two of the rooms can be a bedroom or a study.",
      "It does not get a softer kind of luxury. The same slots carry the price, the mortgage illustration, and the energy illustration.",
      "A larger plan has a larger monthly picture in this sketch. That is deliberate. Space is allowed to look expensive.",
    ],
    features: [
      {
        name: "A taller living room",
        plain:
          "The main room rises above the storey of the bedrooms. It is an architectural choice, and it is not described as a saving.",
      },
      {
        name: "Two rooms with a second use",
        plain:
          "Each can be slept in or worked in. The count of four bedrooms assumes both are used as bedrooms.",
      },
      {
        name: "The same energy ideas, at a larger size",
        plain:
          "A heat pump and heat-recovery ventilation are proposed again. Sizing them for this plan is part of a later design stage, not a result shown here.",
      },
      {
        name: "Cost shown in the same slots",
        plain:
          "Nothing on this page is left as 'premium' without a figure. The comparison page lines the three homes up.",
      },
    ],
    frames: frames("Elevated"),
    purchasePrice: 640_000,
    occupancy: "Four people",
    energyMonthly: 150,
    energyIncludes:
      "A round allowance for heating, hot water, and ordinary electricity for four people. Charging a car is extra, and is not in this line.",
    energyFeature: "The same proposed systems, described for a larger plan",
  },
];

export function getHome(slug: string): Home | undefined {
  return homes.find((home) => home.slug === slug);
}

export function homeCost(home: Home): CostPicture {
  return costPicture(home.purchasePrice, home.energyMonthly);
}
