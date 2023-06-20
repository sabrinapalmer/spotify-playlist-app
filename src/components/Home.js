import React, { useEffect, useState } from 'react';
import {
  clientId,
  redirectUri
} from '../config';
import {
  Icon,
  Slider,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  Typography
} from '@material-ui/core';
import AlbumIcon from '@material-ui/icons/Album';
import PersonIcon from '@material-ui/icons/Person';

function Home(props) {
  const {accessToken, setAccessToken} = props;
  const [spotifyUserName, setSpotifyUserName] = useState('');
  const [settings, setSettings] = useState([
    { name: 'Acousticness', variableName: 'acousticness', min: 0, max: 1 },
    { name: 'Danceability', variableName: 'danceability', min: 0, max: 1 },
    { name: 'Energy', variableName: 'energy', min: 0, max: 1 },
    { name: 'Instrumentalness', variableName: 'instrumentalness', min: 0, max: 1 },
    { name: 'Key', variableName: 'key', min: 0, max: 11 },
    { name: 'Liveness', variableName: 'liveness', min: 0, max: 1 },
    { name: 'Popularity', variableName: 'popularity', min: 0, max: 100 },
    { name: 'Speechiness', variableName: 'speechiness', min: 0, max: 1 },
    { name: 'Tempo', variableName: 'tempo', min: 0, max: 400 },
    { name: 'Valence', variableName: 'valence', min: 0, max: 1 }
  ]);

  const [selectedSettings, setSelectedSettings] = useState([settings[0]]);
  const [recommendations, setRecommendations] = useState([]);
  const [requestURL, setRequestURL] = useState('');
  const [seedOptions, setSeedOptions] = useState([]);
  const [seedType, setSeedType] = useState('Genre');
  const [selectedSeed, setSelectedSeed] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState('');
const [selectedArtistId, setSelectedArtistId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    const userName = localStorage.getItem('spotifyUserName');
    if (token && userName) {
      setAccessToken(token);
      setSpotifyUserName(userName);
    }
  }, []);

  const handleLogout = () => {
    setAccessToken(null);
    setSpotifyUserName('');
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('spotifyUserName');
  };

  const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=token&scope=playlist-modify-public%20user-top-read`;

  const handleSettingChange = (index, min, max) => {
    setSelectedSettings((prevSettings) => {
      const updatedSettings = [...prevSettings];
      updatedSettings[index] = { ...updatedSettings[index], min, max };
      return updatedSettings;
    });
  };

  const handleSettingSelection = (index, variableName) => {
    setSelectedSettings((prevSettings) => {
      const updatedSettings = [...prevSettings];
      updatedSettings[index] = {
        ...updatedSettings[index],
        variableName,
        min: settings.find((s) => s.variableName === variableName)?.min || 0,
        max: settings.find((s) => s.variableName === variableName)?.max || 1
      };
      return updatedSettings;
    });
  };

  const handleAddSetting = () => {
    setSelectedSettings((prevSettings) => {
      const unselectedSettings = settings.filter(
        (setting) => !prevSettings.find((s) => s.variableName === setting.variableName)
      );
      const firstUnselectedSetting = unselectedSettings[0];
      if (firstUnselectedSetting) {
        return [
          ...prevSettings,
          { ...firstUnselectedSetting, min: firstUnselectedSetting.min, max: firstUnselectedSetting.max }
        ];
      }
      return prevSettings;
    });
  };

  const handleClearSettings = () => {
    setSelectedSettings([selectedSettings[0]]);
  };

  const handleSeedTypeChange = (event) => {
    setSeedType(event.target.value);
    setSelectedSeed('');
  };

const handleSeedSelection = (event) => {
  const selectedValue = event.target.value;
  setSelectedSeed(selectedValue);

  if (seedType === 'Track') {
    const selectedTrack = recommendations.find((track) => track.name === selectedValue);
    if (selectedTrack) {
      setSelectedTrackId(selectedTrack.id);
    }
  } else if (seedType === 'Artist') {
    const selectedArtist = recommendations.find((track) =>
      track.artists.some((artist) => artist.name === selectedValue)
    );
    if (selectedArtist) {
      const selectedArtistId = selectedArtist.artists[0];
      setSelectedArtistId(selectedArtist.id);
    }
  }
};

  const fetchSeedOptions = () => {
    const apiEndpoint = `https://api.spotify.com/v1/recommendations/available-genre-seeds`;

    fetch(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching seed options');
        }
        return response.json();
      })
      .then((data) => {
        if (!data.genres) {
          throw new Error('Invalid response data');
        }
        setSeedOptions(data.genres);
      })
      .catch((error) => {
        console.log('Error:', error);
        // Handle the error gracefully, e.g., display an error message to the user
      });
  };

  useEffect(() => {
    const fetchSeedOptions = async () => {
      if (seedType === 'Genre') {
        try {
          const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setSeedOptions(data.genres);
          } else {
            throw new Error('Failed to fetch seed options');
          }
        } catch (error) {
          console.log('Error:', error);
        }
      } else if (seedType === 'Artist') {
        try {
          const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=50', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setSeedOptions(data.items.map((artist) => ({
              name: artist.name,
              id: artist.id,
            })));
          } else {
            throw new Error('Failed to fetch seed options');
          }
        } catch (error) {
          console.log('Error:', error);
        }
      } else if (seedType === 'Track') {
        try {
          const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setSeedOptions(data.items.map((track) => track.name));
            setSeedOptions(data.items.map((track) => ({
              name: track.name,
              id: track.id,
            })));
          } else {
            throw new Error('Failed to fetch seed options');
          }
        } catch (error) {
          console.log('Error:', error);
        }
      }
    };
  
    fetchSeedOptions();
  }, [accessToken, seedType]);
  

  const handleSubmit = () => {
  let seed = '';
  if (seedType === 'Genre') {
    seed = `seed_genres=${selectedSeed}`;
  } else if (seedType === 'Artist') {
    seed = `seed_artists=${selectedSeed}`;
  } else if (seedType === 'Track') {
    seed = `seed_tracks=${selectedSeed}`;
  }
  const apiEndpoint = 'https://api.spotify.com/v1/recommendations';
  
  const queryParams = selectedSettings
    .map(({ variableName, min, max }) => `min_${variableName}=${min}&max_${variableName}=${max}`)
    .join('&');
  const fullUrl = `${apiEndpoint}?${seed}&${queryParams}`;

  setRequestURL(fullUrl);

  // Make the GET request with the updated URL
  fetch(fullUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error fetching recommendations');
      }
      return response.json();
    })
    .then((data) => {
      if (!data.tracks) {
        throw new Error('Invalid response data');
      }
      setRecommendations(data.tracks);
    })
    .catch((error) => {
      console.log('Error:', error);
      // Handle the error gracefully, e.g., display an error message to the user
    });
};


  const renderLoginButton = () => {
    if (accessToken && spotifyUserName) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>{`Logged in as ${spotifyUserName}`}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    } else {
      return (
        <a href={authorizeUrl} style={{ marginLeft: 'auto' }}>
          Login with Spotify
        </a>
      );
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
        <h1 style={{ marginRight: 'auto' }}>Spotify Playlist App</h1>
        {renderLoginButton()}
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ width: '40%', padding: '0 20px', overflow: 'hidden' }}>
          <h2>Settings</h2>
          {selectedSettings.map((setting, index) => (
            <div
              key={setting.variableName}
              style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
            >
              <Select
                value={setting.variableName}
                onChange={(e) => handleSettingSelection(index, e.target.value)}
                style={{ marginRight: '10px', width: '50%' }}
              >
                {settings.map((s, i) => (
                  <MenuItem key={i} value={s.variableName}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
              <div style={{ width: '100%' }}>
                <label style={{ marginRight: '10px' }}>Range:</label>
                <Slider
                  min={settings.find((s) => s.variableName === setting.variableName)?.min || 0}
                  max={settings.find((s) => s.variableName === setting.variableName)?.max || 1}
                  step={
                    settings.find((s) => s.variableName === setting.variableName)?.max / 100 || 0.1
                  }
                  value={[setting.min, setting.max]}
                  onChange={(_, newValue) => handleSettingChange(index, newValue[0], newValue[1])}
                  valueLabelDisplay="auto"
                />
              </div>
            </div>
          ))}
          {settings.length > selectedSettings.length && (
            <button onClick={handleAddSetting}>Add Setting</button>
          )}
          <button onClick={handleClearSettings}>Clear Settings</button>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Select
              value={seedType}
              onChange={handleSeedTypeChange}
              style={{ marginRight: '10px', width: '50%' }}
            >
              <MenuItem value="Genre">Genre</MenuItem>
              <MenuItem value="Artist">Artist</MenuItem>
              <MenuItem value="Track">Track</MenuItem>
            </Select>
            {seedType !== '' && (
              <Select
  value={selectedSeed}
  onChange={handleSeedSelection}
  style={{ marginRight: '10px', width: '50%' }}
>
  {seedOptions.map((seed, index) => (
    <MenuItem key={index} value={seed.id}>
      {seed.name}
    </MenuItem>
  ))}
</Select>
            )}
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </div>

        <div style={{ width: '70%', overflow: 'hidden' }}>
          <h2>Recommendations:</h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 200px)', // Adjust the height as needed
              paddingRight: '16px' // Add padding to account for scrollbar
            }}
          >
            {recommendations.map((track) => (
              <Card
                key={track.id}
                style={{
                  width: '200px',
                  margin: '10px',
                  flexShrink: 0,
                }}
              >
                <CardMedia
                  component="img"
                  alt={track.album.name}
                  height="200"
                  image={track.album.images[0].url}
                />
                <CardContent>
                  <Typography variant="body2" component="p">
                    {track.name}
                  </Typography>
                  <Typography color="textSecondary" variant="caption" component="p">
                    {track.artists.map((artist) => artist.name).join(', ')}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
