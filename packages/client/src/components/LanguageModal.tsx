import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import { countries } from 'country-flag-icons';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { X } from 'react-feather';

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
`;

const Modal = styled.ul`
  user-select: none;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #000000a7;
  list-style-type: none;
  top: 0;
  bottom: 0;
  text-align: center;
  width: 100%;

  li {
    font-size: 1.5rem;
    margin: 1rem;
    cursor: pointer;
    margin: 1rem auto;
    width: fit-content;
    color: #f6f6f6;
  }
`;

function LanguageModal({
  setShowModal,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const modalRef = useRef<HTMLUListElement>(null);
  const scroll = useRef(0);

  const draggingScroll = (e: MouseEvent): void => {
    if (e.currentTarget instanceof HTMLUListElement) {
      console.log(scroll.current - e.clientY);

      e.currentTarget.scrollBy(0, scroll.current - e.clientY);
    }
  };

  const mouseDownHandler = useCallback(
    (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
      console.log(e.clientY);
      if (e.currentTarget instanceof HTMLUListElement) {
        scroll.current = e.clientY;
        e.currentTarget.addEventListener('mousemove', draggingScroll);
      }
    },
    [],
  );

  const mouseUpHandler = useCallback(
    (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
      if (e.target instanceof HTMLUListElement) {
        e.target.removeEventListener('mousemove', draggingScroll);
      }
      e.currentTarget.removeEventListener('mousemove', draggingScroll);
    },
    [],
  );

  window.onmouseup = () => {
    if (modalRef.current) {
      modalRef.current.removeEventListener('mousemove', draggingScroll);
    }
  };

  return (
    <>
      <Modal
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        ref={modalRef}
      >
        {countries.map((code) => (
          <li key={code}>
            {getUnicodeFlagIcon(code)} {code}
          </li>
        ))}
      </Modal>
      <CloseButton type="button" onClick={() => setShowModal(false)}>
        <X />
      </CloseButton>
    </>
  );
}

export default LanguageModal;
