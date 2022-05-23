import React from 'react';
import Home from './components/Home';
import { Routes, Route, HashRouter, BrowserRouter } from 'react-router-dom';
import Chat from './components/Chat';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
