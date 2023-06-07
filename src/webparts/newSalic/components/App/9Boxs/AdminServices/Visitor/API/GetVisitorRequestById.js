import axios from "axios"

export default async function GetVisitorRequestById(email, id) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `https://dev.salic.com/api/Visitor/Get?Email=${email}&Id=${id}`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    console.log(err.response)
    return(err.response)
  }
}