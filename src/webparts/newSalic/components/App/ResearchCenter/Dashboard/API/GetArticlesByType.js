import pnp from 'sp-pnp-js';

export default async function GetArticlesByType(types) {
  try {
    let filterStatment = "";
    types.forEach((type, i) => {
      filterStatment += `ResearchType eq '${type}'`
        if(i !== types.length-1) filterStatment += ' or '
    });
    const res = await pnp.sp.web.lists.getByTitle('Research Articles')
    .items
    .orderBy("Created_x0020_Date", false)
    .select('Author/Title,AttachmentFiles,*')
    .filter(filterStatment)
    .expand('Author,AttachmentFiles')
    .get()
      return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

