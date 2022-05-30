import React, { FormEvent, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import styled from 'styled-components';
import { Socket } from 'socket.io-client';

const Title = styled.h1`
  color: #f6f6f6;
  margin: 1rem;
`;

function Chat({
  messages,
  socket,
  roomName,
  setMessages,
}: {
  roomName: string;
  messages: {
    message: string;
    isSender: boolean;
  }[];
  setMessages: React.Dispatch<
    React.SetStateAction<
      {
        message: string;
        isSender: boolean;
      }[]
    >
  >;
  socket: Socket;
}): JSX.Element {
  const [text, setText] = useState('');
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    socket.connected = true;
    socket.emit('private message', { content: text, roomName });
    setMessages([...messages, { message: text, isSender: true }]);
    setText('');
  };

  return (
    <main
      style={{
        width: '100%',
        position: 'absolute',
        backgroundColor: '#000000a7',
        height: '100vh',
        top: 0,
      }}
    >
      <Title>Chat</Title>
      <ListGroup
        variant="flush"
        style={{ maxHeight: '70%', overflowY: 'auto' }}
      >
        {messages.map((val, i) => (
          <ListGroup.Item
            key={i}
            variant={val.isSender ? 'primary' : undefined}
          >
            {val.message}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Form onSubmit={handleSubmit}>
        <Form.Control
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" variant="success">
          Send
        </Button>
      </Form>
    </main>
  );
}

export default Chat;
