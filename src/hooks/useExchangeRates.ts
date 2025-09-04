import { useQuery } from "@tanstack/react-query";
import { parseExchangeRates, ExchangeRate } from "../utils/currencyParser";

const API_URL =
  "/api/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt";

async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates");
  }
  const textData = await response.text();
  return parseExchangeRates(textData);
}

export function useExchangeRates() {
  return useQuery<ExchangeRate[], Error>({
    queryKey: ["exchangeRates"],
    queryFn: fetchExchangeRates,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
