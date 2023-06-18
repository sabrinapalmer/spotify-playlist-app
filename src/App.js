import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Callback from './components/Callback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/spotify-playlist-app" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
