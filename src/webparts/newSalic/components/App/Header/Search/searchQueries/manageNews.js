import pnp from 'sp-pnp-js';

export default async function manageNews() {
  let data = [];
  try {
    const newsItems = await pnp.sp.web.lists.getByTitle("News")
      .items.select('AttachmentFiles,*').expand('AttachmentFiles')
      .orderBy("CreatedOn", false).get()
      data = newsItems;
    return data;
  } catch(err) {
    console.log(err)
  }
}

