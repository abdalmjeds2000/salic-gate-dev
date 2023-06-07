import axios from 'axios';

export default async function deliveryLettersSearch(query) {
  try {
    const response = await axios.get(`https://dev.salic.com/api/Asset/GetDeliveryNotes?draw=8&order=CreatedAt+desc&start=0&length=20&search[value]=&search[regex]=false&email=&Number=${query}&Department=All&Status=All&AssetName=&_=1669282863275`)
    return response.data;
  } catch(err) {
    console.log(err)
  }
}

