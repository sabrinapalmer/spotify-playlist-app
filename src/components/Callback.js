import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        if (item) {
          const parts = item.split('=');
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});

    if (accessToken.access_token) {
      localStorage.setItem('spotifyAccessToken', accessToken.access_token);
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          localStorage.setItem('spotifyUserName', data.display_name);
          navigate('/');
        })
        .catch(error => {
          console.log('Error fetching user data:', error);
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Render null until the navigation is triggered
  return null;
}

export default Callback;
