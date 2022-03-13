const qs = require('qs');
const axios = require('axios');

const api_youtube = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_YOUTUBE_API,
});

module.exports = {api_youtube};
async function getPlaylist(){
    
    try {
      
      let json = await axios.get(
        'https://www.googleapis.com/youtube/v3/playlistItems', 
        {
          params: { 
              'key': 'AIzaSyD7-ZPCTrB4fYtIkvVXm4zici_IOlpP4N8', 
              'part': 'id',
              'playlistId': 'PLntvgXM11X6pi7mW0O4ZmfUI1xDSIbmTm',
              'maxResults': '50'
          }
        }
        );

      let ids_videos_gross = json.data['items'];
      let ids_videos = [];

      ids_videos_gross.forEach(video => {
        ids_videos.push(video.id);
      })

      // console.log(ids_videos);


  
      return json;
    } catch (error) {
      console.log('deu erro ' + error);
      console.log(error);
    }
  }
  
console.log(getPlaylist());