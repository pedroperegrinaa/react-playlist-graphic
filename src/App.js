import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, Bar, Line, LineChart  } from 'recharts';
import PlaylistThumbImage from './components/PlaylistThumbImage';
import {getPlaylistTT, getPlaylistVideos} from './services/getPlaylist.js';
import info from './images/info.png'

function App() {
  const [videoStats, setVideoStats] = useState([]);
  const [playlistID, setPlaylistID] = useState();
  const [playlistTitle, setPlaylistTitle] = useState();
  let [videoViewsMaxValue, setVideoViewsMaxValue] = useState(1000);
  let [playlistThumb, setPlaylistThumb] = useState();
  let [playlistCountView, setPlaylistCountView] = useState();
  let [totalViews, setTotalViews] = useState();

  function sumArray(array){

    let sum = 0;

    for (let i = 0; i < array.length; i++) {
       sum = sum + array[i];
    }
    setTotalViews(sum.toLocaleString("pt-BR"));
  }

  async function getPlaylistThumb(playlistID){

      let playlistTT_gross = await getPlaylistTT(playlistID);
      
      setPlaylistTitle(playlistTT_gross.data.items['0'].snippet.title);
      setPlaylistThumb(playlistTT_gross.data.items['0'].snippet.thumbnails['standard'].url);

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
      
      getPlaylistThumb(playlistID);

      let playlistItems = await getPlaylistVideos(playlistID);

      let ids_videos_gross = playlistItems.data['items'];

      let ids_videos = [];
      
      ids_videos_gross.forEach(video => {
        ids_videos.push(video.snippet.resourceId.videoId);
      })
      
      console.log(ids_videos);
      setPlaylistCountView(ids_videos.length);

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
      
     console.log(videoViewsMaxValueGross);
     sumArray(videoViewsMaxValueGross);
     setVideoViewsMaxValue(Math.max.apply(Math, videoViewsMaxValueGross));
      setVideoStats(videoStatsGross);
  
    } catch (error) {
      console.log('deu erro ' + error);
      console.log(error);
    }
  }

  return (
    <div className="App">
     <div className="site">
     <h1 className="site-title">Análise de Playlists</h1>
    
    <input className="field-playlistID" type="text" id="" onChange={(e) => setPlaylistID(e.target.value)} />
    {console.log(playlistID)}
    <button className="btn-playlistID"onClick={processPlaylistID}>Buscar</button>
    
    <br />

    <div className="como-usar">
    <img src={info} alt=""/>
    <p>
    Insira no campo acima a URL de algum video da playlist <br /> que você deseja para que o site identifique :)
    </p>
    </div>

    <hr />

    <div className="dashboard">

    <div className="card card-thumb">
    <img src={playlistThumb} alt="icons" className="crop" />
    <p>{playlistTitle}</p>
    </div>

    <div className="card card-views">
    <div className="totais">
    <p>Total de  <br /> videos: </p>
    <span>{playlistCountView}</span>
    </div>
    <hr />
    <div className="totais">
    <p>Total de <br /> views: </p>
    <span>{totalViews}</span>
    </div>
    </div>
    
    <br />

    <LineChart className="grafico" width={800} height={500} data={videoStats} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
<XAxis />
<YAxis domain={[0, dataMax => videoViewsMaxValue + videoViewsMaxValue/10]} allowDataOverflow={true} />
<CartesianGrid strokeDasharray="3 3" />
<Tooltip />
<Line dataKey="viewCount" stroke="#544bfd" />
<Line dataKey="likeCount" stroke="#82ca9d" />
</LineChart>
    </div>
     </div>
    </div>

    
  );
}

export default App;
