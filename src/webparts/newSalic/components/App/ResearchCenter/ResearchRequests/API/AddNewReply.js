import pnp from 'sp-pnp-js';

export default async function AddNewReply(data) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Research Requests Replys').items.add(data)
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

