import { Web } from 'sp-pnp-js';

export default async function AddNewKPI(data) {
  try {
    const web = new Web('https://devsalic.sharepoint.com/sites/MDM');
    const res = await web.lists.getByTitle("KPIs Data").items.add(data);
    return res;
  } catch(err) {
    console.log(err)
    return(err)
  }
}

