import styled from "styled-components";
import { useExchangeRates } from "../../hooks/useExchangeRates";
import CurrencyConverterForm from "../CurrencyConverterForm";

const RateContainer = styled.div`
  text-align: center;
`;
const RateList = styled.table`
  margin: 0 auto;
`;
const RateItemHeader = styled.th`
  padding: 0 50px;
`;
const RateItemRow = styled.tr`
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 20px 0;
  height: 40px;
  border-radius: 10px;
`;

const RateItemData = styled.td``;

const HomePage = () => {
  const { data: rates, isLoading, isError, error } = useExchangeRates();
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <>
      <RateContainer>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <CurrencyConverterForm rates={rates ?? []} />
            <RateList>
              <thead>
                <RateItemHeader>Amount</RateItemHeader>
                <RateItemHeader>Currency</RateItemHeader>
                <RateItemHeader>Code</RateItemHeader>
                <RateItemHeader>Rate</RateItemHeader>
              </thead>
              <tbody>
                {rates?.map((rate) => (
                  <RateItemRow key={rate.code}>
                    <RateItemData>{rate.amount}</RateItemData>
                    <RateItemData>{rate.currency}</RateItemData>
                    <RateItemData>{rate.code}</RateItemData>
                    <RateItemData>{rate.rate} CZK</RateItemData>
                  </RateItemRow>
                ))}
              </tbody>
            </RateList>
          </>
        )}
      </RateContainer>
    </>
  );
};

export default HomePage;
