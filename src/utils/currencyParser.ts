export interface ExchangeRate {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
}

export const parseExchangeRates = (textData: string): ExchangeRate[] => {
  const lines = textData.trim().split("\n");
  const dataLines = lines.slice(2);

  return dataLines.map((line) => {
    const parts = line.split("|");
    return {
      country: parts[0],
      currency: parts[1],
      amount: parseInt(parts[2]),
      code: parts[3],
      rate: parseFloat(parts[4].replace(",", ".")),
    };
  });
};
