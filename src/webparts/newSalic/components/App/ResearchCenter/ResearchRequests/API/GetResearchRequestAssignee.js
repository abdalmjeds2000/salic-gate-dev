import pnp from 'sp-pnp-js';

export default async function GetResearchRequestAssignee(id) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Research Requests Assignee History').items.select('Author/Title,Author/EMail,ToUser/Title,ToUser/EMail,*').filter(`RequestId eq '${id}'`).expand('Author,ToUser').get()
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}

