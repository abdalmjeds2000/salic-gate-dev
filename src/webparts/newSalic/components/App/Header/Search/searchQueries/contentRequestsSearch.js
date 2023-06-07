import pnp from 'sp-pnp-js';

export default async function contentRequestsSearch(query) {
  try {
    const researchRequestsItems = await pnp.sp.web.lists.getByTitle("Content Requests")
      .items.orderBy("Created", false).select('Author/Title,Author/EMail,PendingWith/Title,PendingWith/EMail,*').expand('Author,PendingWith')
      .filter(`substringof('${query}', Title)`).top(50).get()
      return researchRequestsItems;
  } catch(err) {
    console.log(err)
  }
}

