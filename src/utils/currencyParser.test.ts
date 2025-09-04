import { describe, it, expect } from "vitest";
import { parseExchangeRates } from "./currencyParser";

const mockCnbData = `
20.03.2024
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|14.881
Brazil|real|1|BRL|4.856
USA|dollar|1|USD|23.250
`;

describe("parseExchangeRates", () => {
  it("should correctly parse the CNB exchange data", () => {
    const rates = parseExchangeRates(mockCnbData);

    expect(rates).toHaveLength(3);
    expect(rates[0]).toEqual({
      country: "Australia",
      currency: "dollar",
      amount: 1,
      code: "AUD",
      rate: 14.881,
    });
    expect(rates[2]).toEqual({
      country: "USA",
      currency: "dollar",
      amount: 1,
      code: "USD",
      rate: 23.25,
    });
  });

  it("should amounts correctly", () => {
    const dataWithDifferentAmount = `
    20.03.2024
    Country|Currency|Amount|Code|Rate
    Japan|yen|100|JPY|15.450
    `;
    const rates = parseExchangeRates(dataWithDifferentAmount);
    expect(rates[0].amount).toBe(100);
  });
});
