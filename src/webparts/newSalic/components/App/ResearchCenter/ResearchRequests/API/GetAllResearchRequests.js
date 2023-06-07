import pnp from 'sp-pnp-js';

export default async function GetAllResearchRequests() {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Research Requests').items.select('Author/Title,Author/EMail,PendingWith/Title,PendingWith/EMail,*').expand('Author,PendingWith').orderBy("Created", false).get()
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

