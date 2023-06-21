import React, { useEffect, useState } from "react";
import { clientId, redirectUri } from "../config";
import RecommendationCard from "./RecommendationCard";
import Sidebar from "./Sidebar";

function Home(props) {
  const { accessToken, setAccessToken } = props;
  const [spotifyUserName, setSpotifyUserName] = useState("");
  const [settings, setSettings] = useState([
    { name: "Acousticness", variableName: "acousticness", min: 0, max: 1 },
    { name: "Danceability", variableName: "danceability", min: 0, max: 1 },
    { name: "Energy", variableName: "energy", min: 0, max: 1 },
    {
      name: "Instrumentalness",
      variableName: "instrumentalness",
      min: 0,
      max: 1,
    },
    { name: "Key", variableName: "key", min: 0, max: 11 },
    { name: "Liveness", variableName: "liveness", min: 0, max: 1 },
    { name: "Popularity", variableName: "popularity", min: 0, max: 100 },
    { name: "Speechiness", variableName: "speechiness", min: 0, max: 1 },
    { name: "Tempo", variableName: "tempo", min: 0, max: 400 },
    { name: "Valence", variableName: "valence", min: 0, max: 1 },
  ]);

  const [selectedSettings, setSelectedSettings] = useState([settings[0]]);
  const [recommendations, setRecommendations] = useState([]);
  const [requestURL, setRequestURL] = useState("");
  const [seedOptions, setSeedOptions] = useState([]);
  const [seedType, setSeedType] = useState("Genre");
  const [selectedSeed, setSelectedSeed] = useState("");
  const [selectedTrackId, setSelectedTrackId] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);

  const fetchUserPlaylists = () => {
    const apiEndpoint = "https://api.spotify.com/v1/me/playlists";

    fetch(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching user playlists");
        }
        return response.json();
      })
      .then((data) => {
        if (!data.items) {
          throw new Error("Invalid response data");
        }
        setUserPlaylists(data.items);
      })
      .catch((error) => {
        console.log("Error:", error);
        // Handle the error gracefully, e.g., display an error message to the user
      });
  };

  useEffect(() => {
    fetchUserPlaylists();
  }, [accessToken]);

  useEffect(() => {
    const token = localStorage.getItem("spotifyAccessToken");
    const userName = localStorage.getItem("spotifyUserName");
    if (token && userName) {
      setAccessToken(token);
      setSpotifyUserName(userName);
    }
  }, []);

  const handleLogout = () => {
    setAccessToken(null);
    setSpotifyUserName("");
    localStorage.removeItem("spotifyAccessToken");
    localStorage.removeItem("spotifyUserName");
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
        max: settings.find((s) => s.variableName === variableName)?.max || 1,
      };
      return updatedSettings;
    });
  };

  const handleAddSetting = () => {
    setSelectedSettings((prevSettings) => {
      const unselectedSettings = settings.filter(
        (setting) =>
          !prevSettings.find((s) => s.variableName === setting.variableName)
      );
      const firstUnselectedSetting = unselectedSettings[0];
      if (firstUnselectedSetting) {
        return [
          ...prevSettings,
          {
            ...firstUnselectedSetting,
            min: firstUnselectedSetting.min,
            max: firstUnselectedSetting.max,
          },
        ];
      }
      return prevSettings;
    });
  };

  const handleClearSettings = () => {
    setSelectedSettings([]);
  };

  const handleSeedTypeChange = (event) => {
    setSeedType(event.target.value);
    setSelectedSeed("");
    fetchSeedOptions();
  };

  const handleSeedSelection = (event) => {
    const selectedValue = event.target.value;
    setSelectedSeed(selectedValue);

    if (seedType === "Track") {
      const selectedTrack = recommendations.find(
        (track) => track.name === selectedValue
      );
      if (selectedTrack) {
        setSelectedTrackId(selectedTrack.id);
      }
    } else if (seedType === "Artist") {
      const selectedArtist = recommendations.find((track) =>
        track.artists.some((artist) => artist.name === selectedValue)
      );
      if (selectedArtist) {
        const selectedArtistId = selectedArtist.artists[0];
        setSelectedArtistId(selectedArtist.id);
      }
    }
  };

  const handleSelectTrack = (trackId) => {
    setSelectedTracks((prevSelectedTracks) => {
      // Check if the track is already selected
      const isTrackSelected = prevSelectedTracks.includes(trackId);

      if (isTrackSelected) {
        // Deselect the track
        return prevSelectedTracks.filter((id) => id !== trackId);
      } else {
        // Select the track
        return [...prevSelectedTracks, trackId];
      }
    });
  };

  const handleAddToPlaylist = () => {
    // Add selected tracks to the playlist
    if (selectedPlaylist && selectedTracks.length > 0) {
      const apiEndpoint = `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`;
      const data = {
        uris: selectedTracks.map((trackId) => `spotify:track:${trackId}`),
      };

      fetch(apiEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error adding tracks to playlist");
          }
          // Tracks added successfully
          console.log("Tracks added to playlist");
          // Clear the selected tracks
          setSelectedTracks([]);
        })
        .catch((error) => {
          console.log("Error:", error);
          // Handle the error gracefully, e.g., display an error message to the user
        });
    }
  };

  const fetchSeedOptions = () => {
    const apiEndpoint = `https://api.spotify.com/v1/recommendations/available-genre-seeds`;

    fetch(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching seed options");
        }
        return response.json();
      })
      .then((data) => {
        if (!data.genres) {
          throw new Error("Invalid response data");
        }
        setSeedOptions(data.genres);
      })
      .catch((error) => {
        console.log("Error:", error);
        // Handle the error gracefully, e.g., display an error message to the user
      });
  };

  useEffect(() => {
    const fetchSeedOptions = async () => {
      if (seedType === "Genre") {
        try {
          const response = await fetch(
            "https://api.spotify.com/v1/recommendations/available-genre-seeds",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setSeedOptions(
              data.genres.map((genre) => ({ name: genre, id: genre }))
            );
          } else {
            throw new Error("Failed to fetch seed options");
          }
        } catch (error) {
          console.log("Error:", error);
        }
      } else if (seedType === "Artist") {
        try {
          const response = await fetch(
            "https://api.spotify.com/v1/me/top/artists?limit=50",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setSeedOptions(
              data.items.map((artist) => ({
                name: artist.name,
                id: artist.id,
              }))
            );
          } else {
            throw new Error("Failed to fetch seed options");
          }
        } catch (error) {
          console.log("Error:", error);
        }
      } else if (seedType === "Track") {
        try {
          const response = await fetch(
            "https://api.spotify.com/v1/me/top/tracks?limit=50",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setSeedOptions(data.items.map((track) => track.name));
            setSeedOptions(
              data.items.map((track) => ({
                name: track.name,
                id: track.id,
              }))
            );
          } else {
            throw new Error("Failed to fetch seed options");
          }
        } catch (error) {
          console.log("Error:", error);
        }
      }
    };

    fetchSeedOptions();
  }, [accessToken, seedType]);

  const handleSubmit = () => {
    let seed = "";
    if (seedType === "Genre") {
      seed = `seed_genres=${selectedSeed}`;
    } else if (seedType === "Artist") {
      seed = `seed_artists=${selectedSeed}`;
    } else if (seedType === "Track") {
      seed = `seed_tracks=${selectedSeed}`;
    }
    const apiEndpoint = "https://api.spotify.com/v1/recommendations";

    const queryParams = selectedSettings
      .map(
        ({ variableName, min, max }) =>
          `min_${variableName}=${min}&max_${variableName}=${max}`
      )
      .join("&");
    const fullUrl = `${apiEndpoint}?${seed}&${queryParams}`;

    setRequestURL(fullUrl);

    // Make the GET request with the updated URL
    fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching recommendations");
        }
        return response.json();
      })
      .then((data) => {
        if (!data.tracks) {
          throw new Error("Invalid response data");
        }
        setRecommendations(data.tracks);
      })
      .catch((error) => {
        console.log("Error:", error);
        // Handle the error gracefully, e.g., display an error message to the user
      });
  };

  const renderLoginButton = () => {
    if (accessToken && spotifyUserName) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{ marginRight: "10px" }}
          >{`Logged in as ${spotifyUserName}`}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    } else {
      return (
        <a href={authorizeUrl} style={{ marginLeft: "auto" }}>
          Login with Spotify
        </a>
      );
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
        <h1 style={{ marginRight: "auto" }}>Spotify Playlist App</h1>
        {renderLoginButton()}
      </div>

      <div style={{ display: "flex" }}>
        <Sidebar
          accessToken={accessToken}
          settings={settings}
          selectedSettings={selectedSettings}
          seedOptions={seedOptions}
          seedType={seedType}
          selectedSeed={selectedSeed}
          handleSettingSelection={handleSettingSelection}
          handleSettingChange={handleSettingChange}
          handleAddSetting={handleAddSetting}
          handleClearSettings={handleClearSettings}
          handleSeedTypeChange={handleSeedTypeChange}
          handleSeedSelection={handleSeedSelection}
          handleSubmit={handleSubmit}
        />
        <div style={{ width: "70%", overflow: "hidden" }}>
          <select
            value={selectedPlaylist}
            onChange={(event) => setSelectedPlaylist(event.target.value)}
            style={{ marginBottom: "10px" }}
          >
            <option value="">Select Playlist</option>
            {userPlaylists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
          <button
            disabled={!selectedTracks.length || !selectedPlaylist}
            onClick={handleAddToPlaylist}
          >
            Add to Playlist
          </button>

          <h2>Recommendations:</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              overflowY: "auto",
              maxHeight: "calc(100vh - 200px)", // Adjust the height as needed
              paddingRight: "16px", // Add padding to account for scrollbar
            }}
          >
            {recommendations.map((track) => (
              <RecommendationCard
                track={track}
                onSelectTrack={handleSelectTrack}
                isSelected={selectedTracks.includes(track.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
