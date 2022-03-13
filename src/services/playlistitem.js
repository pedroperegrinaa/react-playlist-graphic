import axios from 'axios';

const api_youtube = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_YOUTUBE_API,
});

export default api_youtube;