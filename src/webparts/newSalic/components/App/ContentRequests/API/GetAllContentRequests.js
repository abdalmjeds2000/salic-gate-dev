import pnp from 'sp-pnp-js';

export default async function GetAllContentRequests() {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Content Requests').items.select('Author/Title,Author/EMail,PendingWith/Title,PendingWith/EMail,*').expand('Author,PendingWith').orderBy("Created", false).get()
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

