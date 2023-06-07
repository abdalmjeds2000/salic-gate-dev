import pnp from 'sp-pnp-js';

export default async function UpdateResearchRequest(values, id) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Research Requests').items.getById(id).update(values)
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

