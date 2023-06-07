import axios from "axios";

export default async function GetMyItServiceRequests(email) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `https://dev.salic.com/api/tracking/MyRequests?User=${email}&draw=1&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=-1&search%5Bvalue%5D=&search%5Bregex%5D=false&_=1667892714584`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}