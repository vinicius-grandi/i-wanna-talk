import React, { useCallback, useEffect, useRef, useState } from 'react';
import Client, { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { countries } from 'country-flag-icons';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { X } from 'react-feather';
import Chat from './Chat';

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
  isUserFluent,
}: {
  setShowModal: React.Dispatch<
    React.SetStateAction<boolean | 'fluent' | 'non-fluent'>
  >;
  isUserFluent: boolean;
}): JSX.Element {
  const [socket, setSocket] = useState<Socket>();
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState<
    {
      message: string;
      isSender: boolean;
    }[]
  >([]);
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

  const chatHandler = (code: string): void => {
    if (socket) {
      socket.auth = {
        languageCode: code,
        isUserFluent,
      };
      socket.connect();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', filterCodes);
    return () => document.removeEventListener('keydown', filterCodes);
  }, [filterCodes]);

  // socket.io connection
  useEffect(() => {
    const newSocket =
      socket ||
      Client('http://localhost:5001', {
        autoConnect: false,
      });
    setSocket(newSocket);

    newSocket.on('room status', (msg: string) => {
      setRoomName(msg);
    });

    newSocket.on('private message', (content: string) => {
      setMessages([...messages, { message: content, isSender: false }]);
    });

    newSocket.on('error', (err) => {
      console.log(err);
    });

    console.log('tete');

    return () => setSocket(undefined);
  }, [messages, socket]);

  return (
    <>
      {roomName !== 'No fluents available in the chose language' &&
      roomName.length > 1 &&
      socket !== undefined ? (
        <Chat
          messages={messages}
          socket={socket}
          roomName={roomName}
          setMessages={setMessages}
        />
      ) : (
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
              <li key={code} onClick={() => chatHandler(code)}>
                {getUnicodeFlagIcon(code)} {code}
              </li>
            ))}
        </Modal>
      )}
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
