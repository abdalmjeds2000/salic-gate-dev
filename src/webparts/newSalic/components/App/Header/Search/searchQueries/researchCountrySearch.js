import pnp from 'sp-pnp-js';

export default async function researchCountrySearch(query) {
  try {
    const countryItems = await pnp.sp.web.lists.getByTitle("Research Country Outlook")
      .items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').top(50).expand('AttachmentFiles')
      .filter(`substringof('${query}', Title)`).get()
      return countryItems;
  } catch(err) {
    console.log(err)
  }
}

