import pnp from 'sp-pnp-js';

export default async function researchPulseSearch(query) {
  try {
    const pulseItems = await pnp.sp.web.lists.getByTitle("Research Pulse")
      .items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').expand('AttachmentFiles')
      .filter(`substringof('${query}', Title)`).top(10).getPaged()
      return pulseItems;
  } catch(err) {
    console.log(err)
  }
}

