import './App.css';
import React, { useState, useEffect } from 'react';
import api_youtube from './services/playlistitem.js';
import qs from 'qs';
import axios from 'axios';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, Bar, Line, LineChart  } from 'recharts';
import PlaylistThumbImage from './components/PlaylistThumbImage';
import {getPlaylistTT, getPlaylistVideos} from './services/getPlaylist.js';

function App() {
  const [videoStats, setVideoStats] = useState([]);
  const [playlistID, setPlaylistID] = useState();
  const [playlistTitle, setPlaylistTitle] = useState();
  let [videoViewsMaxValue, setVideoViewsMaxValue] = useState(1000);

  let playlistThumb = '';


  async function getPlaylistThumb(playlistID){

      console.log('aaaaaaaaaaaaaaa');
      let playlistTT_gross = await getPlaylistTT();
      let playlistThumb = playlistTT_gross.data.items['0'].snippet.thumbnails['standard'].url;

      console.log(`O link é ${playlistThumb}`);
      return playlistThumb;

  }

  function processPlaylistID(){
    console.log(playlistID);

    if (playlistID.length === 34) {
      getPlaylist();
    } else {

     if (playlistID.includes('list')) {
       let id = playlistID.substring(playlistID.indexOf('list') + 5);
       id = id.substring(34, 0);
       console.log(id);
       setPlaylistID(id);
       getPlaylist();
     }
    }

  }

  async function getPlaylist(){
    setVideoStats([]);
    
    try {
      
      let playlistTT_gross = await getPlaylistTT(playlistID); // TT = Title e Thumb

      playlistThumb = playlistTT_gross.data.items['0'].snippet.thumbnails['standard'].url;
      setPlaylistTitle(playlistTT_gross.data.items['0'].snippet.localized.title); 

      let playlistItems = await getPlaylistVideos(playlistID);

      let ids_videos_gross = playlistItems.data['items'];

      let ids_videos = [];

      ids_videos_gross.forEach(video => {
        ids_videos.push(video.snippet.resourceId.videoId);
      })

      console.log(ids_videos);

      let videoStatsGross = [];
      let videoViewsMaxValueGross = [];
      
      for (const id of ids_videos) {

        const stats = await axios.get(
          'https://www.googleapis.com/youtube/v3/videos', 
          {
            params: { 
                'key': process.env.REACT_APP_API_KEY, 
                'part': 'statistics',
                'id': id
            }
          }
          );

          const items = stats.data.items;
          videoStatsGross.push(items[0]['statistics']);
          videoViewsMaxValueGross.push(items[0]['statistics']['viewCount']);
      }

     videoViewsMaxValueGross = Object.keys(videoViewsMaxValueGross).map(i => JSON.parse(videoViewsMaxValueGross[Number(i)]));

     setVideoViewsMaxValue(Math.max.apply(Math, videoViewsMaxValueGross));
      setVideoStats(videoStatsGross);
  
    } catch (error) {
      console.log('deu erro ' + error);
      console.log(error);
    }
  }

  return (
    <div className="App">
      <h1>Graficos de Playlists</h1>
    
      <input className="field-playlistID" type="text" id="" onChange={(e) => setPlaylistID(e.target.value)} />
      {console.log(playlistID)}
      <button className="btn-playlistID"onClick={processPlaylistID}>Buscar</button>
      <h2>{playlistTitle}</h2>
     
    <img src={() => getPlaylistThumb(playlistID)} alt="" />

      <br />

      <LineChart className="grafico" width={1000} height={300} data={videoStats}
  margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
  <defs>
    <linearGradient id="viewCount" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
    </linearGradient>
    <linearGradient id="likeCount" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <XAxis />
  <YAxis domain={[0, dataMax => videoViewsMaxValue + videoViewsMaxValue/10]} allowDataOverflow={true} />
  <CartesianGrid strokeDasharray="3 3" />
  <Tooltip />
  <Line dataKey="viewCount" stroke="#544bfd" />
  <Line dataKey="likeCount" stroke="#82ca9d" />
</LineChart>
    </div>

    
  );
}

export default App;
