import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';

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
  const [showModal, setShowModal] = useState<boolean | 'fluent' | 'non-fluent'>(
    false,
  );
  return (
    <Container>
      <Buttons>
        <Fluent type="button" onClick={() => setShowModal('fluent')}>
          FLUENT
        </Fluent>
        <NonFluent type="button" onClick={() => setShowModal('non-fluent')}>
          NON-FLUENT
        </NonFluent>
      </Buttons>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          isUserFluent={showModal === 'fluent'}
        />
      )}
    </Container>
  );
}

export default Home;
