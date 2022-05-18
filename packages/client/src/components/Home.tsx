import React from 'react';
import styled from 'styled-components';

const Container = styled.main`
  display: flex;
  align-content: center;
  justify-content: center;
  background-color: rgb(240, 234, 230);
  height: 50vh;
  width: 100%;
  align-self: center;
`;

const Buttons = styled.div`
  border-style: none;
  width: fit-content;
  align-self: center;
  display: grid;
  grid-template-columns: 1fr 1fr;
  button {
    border-style: none;
    margin: 0 1rem;
    padding: 0.5rem;
    border-radius: 5px;
    color: #f6f6f6;
    font-size: 1.1rem;
    &:hover {
      transform: scale(1.09);
      cursor: pointer;
    }
  }
`;

const Fluent = styled.button`
  background-color: var(--darkO);
`;

const NonFluent = styled.button`
  background-color: var(--lightO);
`;

function Home(): JSX.Element {
  return (
    <Container>
      <Buttons>
        <Fluent type="button">FLUENT</Fluent>
        <NonFluent type="button">NON-FLUENT</NonFluent>
      </Buttons>
    </Container>
  );
}

export default Home;
