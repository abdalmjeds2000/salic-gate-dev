import pnp from 'sp-pnp-js';

export default async function GetResearchNews() {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Research News').items.orderBy("Created_x0020_Date", false).get()
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

