import axios from "axios";

export default async function AddITReply(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: 'https://dev.salic.com/api/tracking/AddComment',
        data: data
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}