import { Web } from "sp-pnp-js";

export default async function UpdateItem(id, data) {
  try {
    const web = new Web('https://devsalic.sharepoint.com/sites/MDM');
    const res = await web.lists
      .getByTitle("KPIs Data")
      .items.getById(id)
      .update(data);
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
}
