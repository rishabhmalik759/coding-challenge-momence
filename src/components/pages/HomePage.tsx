import styled from "styled-components";

const PageHeader = styled.div`
  text-align: center;
`;

const PageTitle = styled.h2`
  font-size: 2.5rem;
  color: black;
`;

const HomePage = () => {
  return (
    <>
      <PageHeader>
        <PageTitle>Daily Exchange Rates</PageTitle>
      </PageHeader>
    </>
  );
};

export default HomePage;
