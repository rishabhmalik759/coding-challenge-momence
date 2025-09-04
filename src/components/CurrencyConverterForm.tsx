import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ExchangeRate } from "../utils/currencyParser";

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const CardContainer = styled.div`
  width: 400px;
  height: 300px;
`;

export const ConverterCard = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 40px;
  margin: 20px 0;
  height: 200px;
`;

const Input = styled.input`
  width: 130px;
  height: 25px;
`;

const Select = styled.select`
  width: 138px;
  height: 28px;
`;

const Result = styled.p`
  display: flex;
  justify-content: space-around;
`;
const InputLabel = styled.label`
  display: flex;
  justify-content: space-between;
`;
const InputContainer = styled.div`
  margin-bottom: 15px;
`;

interface CurrencyConverterFormProps {
  rates: ExchangeRate[];
}

const CurrencyConverterForm: React.FC<CurrencyConverterFormProps> = ({
  rates,
}) => {
  const [czkAmount, setCzkAmount] = useState<number | "">(100);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    if (rates.length > 0 && !selectedCurrencyCode) {
      setSelectedCurrencyCode(rates[0].code);
    }
  }, [rates, selectedCurrencyCode]);

  const handleConversion = React.useCallback(() => {
    if (czkAmount === "" || !selectedCurrencyCode) {
      setConvertedAmount(null);
      return;
    }

    const selectedRate = rates.find(
      (rate) => rate.code === selectedCurrencyCode
    );

    if (selectedRate) {
      const result = (czkAmount / selectedRate.rate) * selectedRate.amount;
      setConvertedAmount(parseFloat(result.toFixed(2))); // Format to 2 decimal places
    } else {
      setConvertedAmount(null);
    }
  }, [czkAmount, selectedCurrencyCode, rates]);

  useEffect(() => {
    handleConversion();
  }, [czkAmount, selectedCurrencyCode, rates, handleConversion]);

  return (
    <FormWrapper>
      <CardContainer style={{ width: "400px" }}>
        <ConverterCard>
          <h2>Convert CZK</h2>
          <InputContainer style={{ marginBottom: "20px" }}>
            <InputLabel>
              Amount (CZK)
              <Input
                type="number"
                value={czkAmount}
                onChange={(e) =>
                  setCzkAmount(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
              />
            </InputLabel>
          </InputContainer>
          <div>
            <InputLabel>
              Select Currency
              <Select
                value={selectedCurrencyCode}
                onChange={(e) => setSelectedCurrencyCode(e.target.value)}
              >
                <option value="">Select a currency</option>
                {rates.map((rate) => (
                  <option key={rate.code} value={rate.code}>
                    {rate.code} - {rate.currency}
                  </option>
                ))}
              </Select>
            </InputLabel>
          </div>
          {convertedAmount !== null && selectedCurrencyCode && (
            <Result>
              <div>Converted Amount</div>
              <div>
                {convertedAmount} {selectedCurrencyCode}
              </div>
            </Result>
          )}
        </ConverterCard>
      </CardContainer>
    </FormWrapper>
  );
};

export default CurrencyConverterForm;
