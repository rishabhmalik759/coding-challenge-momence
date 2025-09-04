import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import HomePage from "./HomePage";
import { ExchangeRate } from "../../utils/currencyParser";

vi.mock("../../hooks/useExchangeRates", () => ({
  useExchangeRates: vi.fn(),
}));

vi.mock("../CurrencyConverterForm", () => ({
  default: vi.fn((props) => (
    <div>
      Mocked Currency Converter Form (Rates Count: {props.rates.length})
    </div>
  )),
}));

const mockRates: ExchangeRate[] = [
  { country: "USA", currency: "dollar", amount: 1, code: "USD", rate: 23.0 },
  { country: "Eurozone", currency: "euro", amount: 1, code: "EUR", rate: 25.0 },
  { country: "Japan", currency: "yen", amount: 100, code: "JPY", rate: 16.0 },
];

describe("HomePage", () => {
  let mockUseExchangeRates: Mock;
  let mockCurrencyConverterForm: Mock;

  beforeEach(async () => {
    mockUseExchangeRates = vi.mocked(
      (await import("../../hooks/useExchangeRates"))
        .useExchangeRates as unknown as Mock
    );
    mockCurrencyConverterForm = vi.mocked(
      (await import("../CurrencyConverterForm")).default as Mock
    );

    mockUseExchangeRates.mockReset();
    mockCurrencyConverterForm.mockClear();

    mockUseExchangeRates.mockReturnValue({
      data: mockRates,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should display a loading message when data is being fetched", () => {
    mockUseExchangeRates.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<HomePage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Mocked Currency Converter Form/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should display an error message when data fetching fails", () => {
    const errorMessage = "Failed to load rates!";
    mockUseExchangeRates.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error(errorMessage),
    });

    render(<HomePage />);
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Mocked Currency Converter Form/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should render the CurrencyConverterForm and the exchange rate table when data is loaded successfully", async () => {
    render(<HomePage />);

    expect(
      screen.getByText(/Mocked Currency Converter Form \(Rates Count: 3\)/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: /Amount/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Currency/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Code/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Rate/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText("1")).toHaveLength(2);
      expect(screen.getByText("dollar")).toBeInTheDocument();
      expect(screen.getByText("USD")).toBeInTheDocument();
      expect(screen.getByText("23 CZK")).toBeInTheDocument();

      expect(screen.getByText("euro")).toBeInTheDocument();
      expect(screen.getByText("EUR")).toBeInTheDocument();
      expect(screen.getByText("25 CZK")).toBeInTheDocument();

      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("yen")).toBeInTheDocument();
      expect(screen.getByText("JPY")).toBeInTheDocument();
      expect(screen.getByText("16 CZK")).toBeInTheDocument();
    });
  });

  it("should pass the fetched rates to the CurrencyConverterForm", async () => {
    render(<HomePage />);

    const CurrencyConverterFormComponent = vi.mocked(
      (await import("../CurrencyConverterForm")).default as Mock
    );

    expect(CurrencyConverterFormComponent).toHaveBeenCalledWith(
      { rates: mockRates },
      undefined
    );
  });

  it("should render an empty list or not break if rates is empty but not loading/error", () => {
    mockUseExchangeRates.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<HomePage />);
    expect(
      screen.getByText(/Mocked Currency Converter Form \(Rates Count: 0\)/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByText(/USD/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/EUR/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/JPY/i)).not.toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.queryByText("100")).not.toBeInTheDocument();
  });
});
