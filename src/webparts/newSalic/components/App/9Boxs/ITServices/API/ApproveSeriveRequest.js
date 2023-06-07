import axios from "axios";

export default async function ApproveSeriveRequest(id) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `https://dev.salic.com/api/tracking/Accept/${id}`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}