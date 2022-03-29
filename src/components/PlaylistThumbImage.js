import React from 'react';
import {getPlaylistTT} from '../services/getPlaylist.js';


function PlaylistThumbImage(props){

    let playlistID = props.playlistID;

    console.log(`primeiro log ${playlistID}`);

    async function getPlaylistThumb(playlistID){

        console.log('aaaaaaaaaaaaaaa');
        let playlistTT_gross = await getPlaylistTT();
        let playlistThumb = playlistTT_gross.data.items['0'].snippet.thumbnails['standard'].url;

        console.log(`O link é ${playlistThumb}`);
        return playlistThumb;

    }

    return(
        <>
        <br />
        aaaaaaaa
        <h3>{getPlaylistThumb}</h3>
        {/* <img src={getPlaylistThumb} alt="" /> */}
        </>
    )
    }

export default PlaylistThumbImage;