import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import MeetingPointFinder from './MeetingPointFinder';
import Impressum from './Impressum';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MeetingPointFinder />} />
        <Route path="/impressum" element={<Impressum />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;