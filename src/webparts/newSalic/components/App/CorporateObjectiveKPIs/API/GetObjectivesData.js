import { Web } from "sp-pnp-js";

export default async function GetObjectivesData(year, sector) {
  try {
    const web = new Web('https://devsalic.sharepoint.com/sites/MDM');
    const query = `Year eq '${year}' ${sector ? `and field_16 eq '${sector}` : ''}'`;
    const response = await web.lists
      .getByTitle("KPIs Data")
      .items.filter(query).get();
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
