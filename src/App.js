import './App.css';
import api_youtube from './services/playlistitem.js'
import qs from 'qs'

function App() {

console.log(api_youtube);

const params = {
  key: process.env.API_KEY,
}

async function getPlaylist(){
  const json = await api_youtube.get('//playlistItems', qs.stringify({ 'key': process.env.API_KEY }))
}


  return (
    <div className="App">
      <h1>Graficos de Playlists</h1>
    </div>
  );
}

export default App;
