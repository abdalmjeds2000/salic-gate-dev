import axios from "axios";

export default async function GetSummaryByRequestType(email) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `https://dev.salic.com/api/Tracking/SummaryByRequestType?Email=${email}`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}