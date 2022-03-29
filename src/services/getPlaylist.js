import axios from 'axios';

export async function getPlaylistTT(playlistID) {

    try {
        let playlistTT_gross = await axios.get( // TT = Title e Thumb
            'https://www.googleapis.com/youtube/v3/playlists', 
            {
              params: { 
                  'key': process.env.REACT_APP_API_KEY, 
                  'part': 'snippet',
                  'id': playlistID,
              }
            }
            );
    
            return playlistTT_gross;

    } catch (error) {
        console.log(error);
    }
}

export async function getPlaylistVideos(playlistID) {
    try {
        let playlistItems = await axios.get(
            'https://www.googleapis.com/youtube/v3/playlistItems', 
            {
              params: { 
                  'key': process.env.REACT_APP_API_KEY, 
                  'part': 'snippet',
                  'playlistId': playlistID,
                  'maxResults': '60'
              }
            }
            );

            return playlistItems;
        
    } catch (error) {
        console.log(error);
    }
}