const axios = require('axios');

const api_youtube = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_YOUTUBE_API,
});

async function getPlaylist(){
    
    try {
      
      let playlistItems = await axios.get(
        'https://www.googleapis.com/youtube/v3/playlistItems', 
        {
          params: { 
              'key': 'AIzaSyD7-ZPCTrB4fYtIkvVXm4zici_IOlpP4N8', 
              'part': 'snippet',
              'playlistId': 'PLntvgXM11X6pi7mW0O4ZmfUI1xDSIbmTm',
              'maxResults': '10'
          }
        }
        );

      let ids_videos_gross = playlistItems.data['items'];

      let ids_videos = [];

      ids_videos_gross.forEach(video => {
        ids_videos.push(video.snippet.resourceId.videoId);
      })

      console.log(ids_videos);

      const video_stats = [];

      for (const id of ids_videos) {
        // video_stats.push(getVideoViews(id));

        const stats = await axios.get(
          'https://www.googleapis.com/youtube/v3/videos', 
          {
            params: { 
                'key': 'AIzaSyD7-ZPCTrB4fYtIkvVXm4zici_IOlpP4N8', 
                'part': 'statistics',
                'id': id
            }
          }
          );

          const items = stats.data.items;

          video_stats.push(items[0]['statistics']);
      }

      console.log(video_stats);

      video_stats.forEach(stats => console.log(stats.viewCount));

      return video_stats;
       
      //https://www.googleapis.com/youtube/v3/videos?part=statistics&id=eW7OPtImIRw&key={API-KEY}
      // console.log(ids_videos);
  
    } catch (error) {
      console.log('deu erro ' + error);
      console.log(error);
    }
  }
  
console.log(getPlaylist());