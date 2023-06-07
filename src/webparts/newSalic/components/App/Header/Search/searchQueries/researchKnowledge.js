import pnp from 'sp-pnp-js';

export default async function researchKnowledge() {
  try {
    const countryItems = await pnp.sp.web.lists.getByTitle("Knowledge Center")
      .items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').expand('AttachmentFiles')
      .top(24).getPaged()
      return countryItems;
  } catch(err) {
    console.log(err)
  }
}

