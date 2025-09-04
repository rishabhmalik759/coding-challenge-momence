import { describe, it, expect, vi, beforeEach, Mock, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import CurrencyConverterForm from "./CurrencyConverterForm";
import { ExchangeRate } from "../utils/currencyParser";

vi.mock("../hooks/useExchangeRates", () => ({
  useExchangeRates: vi.fn(),
}));

const mockRates: ExchangeRate[] = [
  { country: "USA", currency: "dollar", amount: 1, code: "USD", rate: 23.0 },
  { country: "Eurozone", currency: "euro", amount: 1, code: "EUR", rate: 25.0 },
  { country: "Japan", currency: "yen", amount: 100, code: "JPY", rate: 16.0 },
];

describe("CurrencyConverterForm", () => {
  beforeEach(async () => {
    const { useExchangeRates } = await import("../hooks/useExchangeRates");
    (useExchangeRates as Mock).mockReturnValue({
      data: mockRates,
      isLoading: false,
      isError: false,
      error: null,
    });
  });
  beforeAll(() => {
    waitFor(() => {
      render(<CurrencyConverterForm rates={mockRates} />);
    });
  });

  it("should display the conversion form", () => {
    expect(screen.getByLabelText(/Amount \(CZK\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Currency/i)).toBeInTheDocument();
  });

  it("should convert CZK to USD correctly", async () => {
    const czkInput = screen.getByLabelText(/Amount \(CZK\)/i);
    const currencySelect = screen.getByLabelText(/Select Currency/i);

    fireEvent.change(czkInput, { target: { value: "1000" } });
    fireEvent.change(currencySelect, { target: { value: "USD" } });

    await waitFor(() => {
      expect(screen.getByText(/Converted Amount/i)).toBeInTheDocument();
      expect(screen.getByText(/43.48 USD/i)).toBeInTheDocument();
    });
  });

  it("should convert CZK to JPY correctly, considering amount factor", async () => {
    const czkInput = screen.getByLabelText(/Amount \(CZK\)/i);
    const currencySelect = screen.getByLabelText(/Select Currency/i);

    fireEvent.change(czkInput, { target: { value: "160" } });
    fireEvent.change(currencySelect, { target: { value: "JPY" } });

    await waitFor(() => {
      expect(screen.getByText(/Converted Amount/i)).toBeInTheDocument();
      expect(screen.getByText(/1000 JPY/i)).toBeInTheDocument();
    });
  });
});
