import pnp from 'sp-pnp-js';

export default async function AddContentRequest(data) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Content Requests').items.add(data)
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

