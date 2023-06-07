import pnp from 'sp-pnp-js';

export default async function researchAdHoc() {
  try {
    const articlesItems = await pnp.sp.web.lists.getByTitle('Research Articles')
    .items.orderBy('Created', false)
    .select('AttachmentFiles,*').expand('AttachmentFiles')
    .filter(`ResearchType eq 'AdHoc'`).top(24).getPaged()
    return articlesItems;
  } catch(err) {
    console.log(err)
  }
}
