import pnp from 'sp-pnp-js';

export default async function UpdateContentRequest(values, id) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Content Requests').items.getById(id).update(values)
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

