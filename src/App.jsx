import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MeetingPointFinder from './MeetingPointFinder';
import Impressum from './Impressum';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MeetingPointFinder />} />
        <Route path="/impressum" element={<Impressum />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;