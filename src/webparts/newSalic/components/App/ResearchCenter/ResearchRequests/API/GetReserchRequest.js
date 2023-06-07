import pnp from 'sp-pnp-js';

export default async function GetResearchRequest(id) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Research Requests').items.getById(id).select('Author/Title,Author/EMail,PendingWith/Title,PendingWith/EMail,*').expand('Author,PendingWith').get()
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

