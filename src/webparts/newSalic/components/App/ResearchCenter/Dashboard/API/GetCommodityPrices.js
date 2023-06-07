import pnp from 'sp-pnp-js';

export default async function GetCommodityPrices() {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Commodity Prices').items.orderBy("Created_x0020_Date", true).get()
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

