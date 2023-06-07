import pnp from 'sp-pnp-js';

export default async function UpdateMaintenanceRequest(values) {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Maintenance Request').items.getById(values.Id).update({
      Title: values.Requester, 
      Requester: values.Requester, 
      Location: values.Location,
      Descriptions: values.Descriptions
    })
    return res
  } catch(err) {
      console.log(err)
      return(err)
    }
}
