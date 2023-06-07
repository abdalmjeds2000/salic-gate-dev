import axios from 'axios';

export default async function researchCenterSearch(query) {
  try {
    const response = await axios.get(`https://dev.salic.com/api/tracking/Get?draw=3&order=Id%20desc&start=0&length=20&search[value]=&search[regex]=false&email=&query=${query}&_=1668265007659`);
    return response;
  } catch(err) {
    console.log(err)
  }
}

