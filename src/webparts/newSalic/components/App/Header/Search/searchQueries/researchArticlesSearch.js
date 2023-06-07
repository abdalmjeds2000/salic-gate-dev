import pnp from 'sp-pnp-js';

export default async function researchArticlesSearch(query) {
  try {
    const articlesItems = await pnp.sp.web.lists.getByTitle("Research Articles")
      .items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').expand('AttachmentFiles')
      .filter(`substringof('${query}', Title)`).top(10).getPaged()
      return articlesItems;
  } catch(err) {
    console.log(err)
  }
}
