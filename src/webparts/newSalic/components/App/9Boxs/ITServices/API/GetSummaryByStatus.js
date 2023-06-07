import axios from "axios";

export default async function GetSummaryByStatus(email) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `https://dev.salic.com/api/Tracking/SummaryByStatus?Email=${email}`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}