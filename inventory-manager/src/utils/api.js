import axios from 'axios';

const api = axios.create({
  baseURL: 'https://3000-prashantaeg-dynamolearn-ighx8i5hkie.ws-us104.gitpod.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
