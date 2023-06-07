import axios from "axios"

export default async function IssuingVISARequest(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: 'https://dev.salic.com/api/VISA/Add',
        data: data
      }
    )
    let response = request;
    return response

  } catch(err) {
    console.log(err.response)
    return(err.response)
  }
}