import axios from "axios";

export default async function AddItServiceRequest(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: 'https://dev.salic.com/api/tracking/Add',
        data: data
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}