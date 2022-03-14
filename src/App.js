import './App.css';
import React, { useState, useEffect } from 'react';
import api_youtube from './services/playlistitem.js';
import qs from 'qs';
import axios from 'axios';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area  } from 'recharts';

function App() {
  const [videoStats, setVideoStats] = useState([]);
  let [videoViewsMaxValue, setVideoViewsMaxValue] = useState(1000);

  async function getPlaylist(){
    setVideoStats([]);
    
    try {
      
      let playlistItems = await axios.get(
        'https://www.googleapis.com/youtube/v3/playlistItems', 
        {
          params: { 
              'key': process.env.REACT_APP_API_KEY, 
              'part': 'snippet',
              'playlistId': 'PLntvgXM11X6pi7mW0O4ZmfUI1xDSIbmTm',
              'maxResults': '60'
          }
        }
        );

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
      <button onClick={getPlaylist}>Botaozinho</button>
      <br />
  {console.log(videoStats)}
      <br />
      aaaaaaaaaaa

      <AreaChart align="center" width={730} height={200} data={videoStats}
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
  <YAxis domain={[0, dataMax => videoViewsMaxValue + 9000]} allowDataOverflow={true} />
  {/* <CartesianGrid strokeDasharray="3 3" /> */}
  <Tooltip />
  <Area type="monotone" dataKey="viewCount" stroke="#8884d8" fillOpacity={1} fill="#21B6AB" />
  <Area type="monotone" dataKey="likeCount" stroke="#18A558" fillOpacity={1} fill="#116530" />
</AreaChart>
    </div>

    
  );
}

export default App;
