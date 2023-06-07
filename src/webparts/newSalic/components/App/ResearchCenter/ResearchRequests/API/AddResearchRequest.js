import pnp from 'sp-pnp-js';

export default async function AddResearchRequest(data) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Research Requests').items.add(data)
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

