import React from "react";
import styled from "styled-components";
import { NavLink, Outlet } from "react-router-dom";

const AppWrapper = styled.div``;

const AppHeader = styled.header`
  padding: 0 2rem;
  display: flex;
`;

const HeaderTitle = styled.h1`
  margin-right: 30px;
  font-size: 1.5rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  padding: 22px 0.5rem;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  color: black;
  &.active {
    border-bottom-color: #ca3267ff;
  }
  &:hover {
    color: #ca3267ff;
  }
`;

const AppMain = styled.main`
  flex: 1;
`;

const Layout: React.FC = () => {
  return (
    <AppWrapper>
      <AppHeader>
        <HeaderTitle>Exchange Rates</HeaderTitle>
        <Nav>
          <StyledNavLink to="/">Home</StyledNavLink>
        </Nav>
      </AppHeader>
      <AppMain>
        <Outlet />
      </AppMain>
    </AppWrapper>
  );
};

export default Layout;
