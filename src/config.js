const clientId = '4e368c07360846768ea2f59a44da7d4d';
const isLocal = process.env.NODE_ENV === 'development';
const redirectUri = isLocal
  ? 'http://localhost:3000/callback'
  : 'https://sabrinapalmer.github.io/spotify-playlist-app/callback';

export { clientId, redirectUri };