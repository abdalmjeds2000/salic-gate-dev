import axios from "axios"

export default async function GetMyRequests(email) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `https://dev.salic.com/api/Processes/My?Email=${email}&draw=1&start=0&length=-1`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    console.log(err.response)
    return(err.response)
  }
}