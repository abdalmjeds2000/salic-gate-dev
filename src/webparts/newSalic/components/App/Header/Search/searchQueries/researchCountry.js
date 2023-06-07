import pnp from 'sp-pnp-js';

export default async function researchCountry() {
  try {
    const countryItems = await pnp.sp.web.lists.getByTitle("Research Country Outlook")
      .items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').expand('AttachmentFiles')
      .get()
      return countryItems;
  } catch(err) {
    console.log(err)
  }
}

