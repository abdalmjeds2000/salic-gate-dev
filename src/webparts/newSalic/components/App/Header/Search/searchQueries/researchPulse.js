import pnp from 'sp-pnp-js';

export default async function researchPulse() {
  try {
    const pulseItems = await pnp.sp.web.lists.getByTitle("Research Pulse")
      .items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').expand('AttachmentFiles')
      .top(24).getPaged()
      return pulseItems;
  } catch(err) {
    console.log(err)
  }
}

