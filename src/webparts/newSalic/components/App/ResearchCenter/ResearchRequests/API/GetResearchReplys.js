import pnp from 'sp-pnp-js';

export default async function GetResearchReplys(id) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Research Requests Replys').items.select('Author/Title,Author/EMail,*').filter(`RequestIDId eq '${id}'`).expand('Author').get()
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

