import pnp from 'sp-pnp-js';

export default async function GetResearchArticles() {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Research Articles').items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').expand('AttachmentFiles').get()
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

