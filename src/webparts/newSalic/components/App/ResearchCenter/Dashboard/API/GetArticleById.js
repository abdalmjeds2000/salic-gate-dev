import pnp from 'sp-pnp-js';

export default async function GetArticleById(id) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Research Articles').items.getById(id).select('Author/Title,AttachmentFiles,*').expand('Author,AttachmentFiles').get()
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

