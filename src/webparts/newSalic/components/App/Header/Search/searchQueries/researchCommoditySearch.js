import pnp from 'sp-pnp-js';

export default async function researchCommoditySearch(query) {
  try {
    const articlesItems = await pnp.sp.web.lists.getByTitle("Research Articles")
      .items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').expand('AttachmentFiles')
      .filter(`ResearchType eq 'Commodity' and substringof('${query}', Title)`).top(10).getPaged()
      return articlesItems;
  } catch(err) {
    console.log(err)
  }
}

