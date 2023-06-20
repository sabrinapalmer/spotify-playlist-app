import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Callback from './components/Callback';
import Login from './components/Login';




function App() {
  const [accessToken, setAccessToken] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);
  const isLocal = process.env.NODE_ENV === 'development';

  return (
    <Router basename={isLocal?"":"/spotify-playlist-app"}>
      <Routes>
        <Route path="/spotify-playlist-app" element={accessToken ? <Home accessToken={accessToken} setAccessToken={setAccessToken}/>:<Login />} />
        <Route path="/" element={accessToken ? <Home accessToken={accessToken} setAccessToken={setAccessToken}/>:<Login />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
