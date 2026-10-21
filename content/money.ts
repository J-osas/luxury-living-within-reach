import { workedExample } from "@/content/site";

export function formatPounds(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Standard repayment illustration. Rounded to the nearest pound. */
export function monthlyRepayment(
  loan: number,
  annualRate: number,
  years: number,
): number {
  const monthlyRate = annualRate / 12;
  const payments = years * 12;
  const growth = (1 + monthlyRate) ** payments;
  return Math.round((loan * monthlyRate * growth) / (growth - 1));
}

export type CostPicture = {
  purchasePrice: number;
  deposit: number;
  borrowed: number;
  mortgageMonthly: number;
  energyMonthly: number;
  monthlyPicture: number;
};

export function costPicture(
  purchasePrice: number,
  energyMonthly: number,
): CostPicture {
  const deposit = Math.round(purchasePrice * workedExample.depositRate);
  const borrowed = purchasePrice - deposit;
  const mortgageMonthly = monthlyRepayment(
    borrowed,
    workedExample.annualRate,
    workedExample.termYears,
  );
  return {
    purchasePrice,
    deposit,
    borrowed,
    mortgageMonthly,
    energyMonthly,
    monthlyPicture: mortgageMonthly + energyMonthly,
  };
}
