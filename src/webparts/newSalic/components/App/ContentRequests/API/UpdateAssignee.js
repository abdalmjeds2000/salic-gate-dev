import pnp from 'sp-pnp-js';

export default async function UpdateAssignee(values, id) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Content Requests Assignee History').items.getById(id).update(values)
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

