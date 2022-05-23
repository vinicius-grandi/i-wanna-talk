import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const [filter, setFilter] = useState('');
  const scroll = useRef(0);

  const filterCodes = useCallback(
    (ev: KeyboardEvent): void => {
      if (ev.key === 'Backspace') {
        setFilter('');
      }
      const keyCode = ev.key.toLowerCase().charCodeAt(0);
      const newFilter = filter + ev.key;
      if (
        keyCode >= 97 &&
        keyCode <= 122 &&
        ev.key.length === 1 &&
        newFilter.length <= 2
      ) {
        return setFilter(filter + ev.key);
      }
      return setFilter('');
    },
    [filter],
  );

  const draggingScroll = (e: MouseEvent): void => {
    if (e.currentTarget instanceof HTMLUListElement) {
      e.currentTarget.scrollBy(0, scroll.current - e.clientY);
    }
  };

  const mouseDownHandler = useCallback(
    (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
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

  useEffect(() => {
    document.addEventListener('keydown', filterCodes);
    return () => document.removeEventListener('keydown', filterCodes);
  }, [filterCodes]);

  return (
    <>
      <Modal
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onMouseOut={(e) => {
          e.currentTarget.removeEventListener('mousemove', draggingScroll);
        }}
        ref={modalRef}
      >
        {countries
          .filter((code) => {
            const regex = new RegExp(`^${filter}`, 'i');
            return code.match(regex);
          })
          .map((code) => (
            <li key={code}>
              {getUnicodeFlagIcon(code)} {code}
            </li>
          ))}
      </Modal>
      <CloseButton
        type="button"
        onClick={() => {
          setShowModal(false);
        }}
      >
        <X />
      </CloseButton>
    </>
  );
}

export default LanguageModal;
