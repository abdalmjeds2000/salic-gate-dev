import pnp from 'sp-pnp-js';

export default async function researchRequests() {
  try {
    const researchRequestsItems = await pnp.sp.web.lists.getByTitle("Research Requests")
      .items.orderBy("Created", false).select('Author/Title,Author/EMail,PendingWith/Title,PendingWith/EMail,*').expand('Author,PendingWith')
      .get()
      return researchRequestsItems;
  } catch(err) {
    console.log(err)
  }
}

