import pnp from 'sp-pnp-js';

export default async function manageNewsSearch(query) {
  let data = [];
  try {
    const newsItems = await pnp.sp.web.lists.getByTitle("News")
      .items.select('AttachmentFiles,*').expand('AttachmentFiles')
      .orderBy("CreatedOn", false).filter(`substringof('${query}', Subject)`).get()
      data = newsItems;
    return data;
  } catch(err) {
    console.log(err)
  }
}

