import axios from "axios";

export default async function DeleteSeriveRequest(id, message) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: `https://dev.salic.com/api/tracking/DeleteServiceRequest/${id}`,
        data: { message: message }
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}