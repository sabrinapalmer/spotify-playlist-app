import React from "react";
import { clientId, redirectUri } from "../config";

function Login() {
  const baseRedirectUri = encodeURIComponent(redirectUri);
  const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${baseRedirectUri}&response_type=token&scope=playlist-modify-public%20user-top-read`;

  return (
    <div>
      <h1>Login</h1>
      <a href={authorizeUrl}>Login with Spotify</a>
    </div>
  );
}

export default Login;
