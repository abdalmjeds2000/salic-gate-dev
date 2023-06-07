import pnp from 'sp-pnp-js';

export default async function researchKnowledgeSearch(query) {
  try {
    const countryItems = await pnp.sp.web.lists.getByTitle("Knowledge Center")
      .items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').expand('AttachmentFiles')
      .filter(`substringof('${query}', Title)`).top(10).getPaged()
      return countryItems;
  } catch(err) {
    console.log(err)
  }
}

