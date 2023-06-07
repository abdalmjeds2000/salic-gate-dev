import pnp from 'sp-pnp-js';

export default async function researchCenterSearch(query) {
  let data = [];
  try {
    const articlesItems = await pnp.sp.web.lists.getByTitle("Research Articles")
      .items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').top(50).expand('AttachmentFiles')
      .filter(`substringof('${query}', Title)`).get()
        data.push({title: 'Research Articles', data: articlesItems});
    const pulseItems = await pnp.sp.web.lists.getByTitle("Research Pulse")
      .items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').top(50).expand('AttachmentFiles')
      .filter(`substringof('${query}', Title)`).get()
        data.push({title: 'Pulse', data: pulseItems});
    const countryItems = await pnp.sp.web.lists.getByTitle("Research Country Outlook")
      .items.orderBy("Created_x0020_Date", false).select('AttachmentFiles,*').top(50).expand('AttachmentFiles')
      .filter(`substringof('${query}', Title)`).get()
        data.push({title: 'Country Outlook', data: countryItems});


    return data;
  } catch(err) {
    console.log(err)
  }
}

