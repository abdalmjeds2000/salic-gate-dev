import { Web } from "sp-pnp-js";

export default async function DeleteKpiItem(id) {
  try {
    const web = new Web('https://devsalic.sharepoint.com/sites/MDM');
    const res = await web.lists
      .getByTitle("KPIs Data")
      .items.getById(id)
      .delete();
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
}
