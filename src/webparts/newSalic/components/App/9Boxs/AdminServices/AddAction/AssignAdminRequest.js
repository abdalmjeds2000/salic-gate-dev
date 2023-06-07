import axios from "axios"

export default async function AssignAdminRequest(type, data) {
  try {
    let request = await axios(
      {
        method: "POST",
        url: `https://dev.salic.com/api/${type}/Assign`,
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