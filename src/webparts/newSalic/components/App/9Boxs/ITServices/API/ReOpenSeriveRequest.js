import axios from "axios";

export default async function ReOpenSeriveRequest(data) {
  try {
    let request = await axios(  
      {
        method: 'POST',
        url: "https://dev.salic.com/api/tracking/ReOpenServiceRequest",
        data: data
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}