import axios from "axios";

export default async function GetITRequest(email, id) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `https://dev.salic.com/api/Tracking/GetById?Email=${email}&Id=${id}`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}