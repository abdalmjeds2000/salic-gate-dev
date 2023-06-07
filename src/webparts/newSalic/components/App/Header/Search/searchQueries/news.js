import pnp from 'sp-pnp-js';

export default async function news() {
  try {
    const response = await pnp.sp.web.lists.getByTitle('News').items
      .select('Author/Title,Author/EMail,Author/JobTitle,AttachmentFiles,*').expand('Author,AttachmentFiles').top(500)
      .orderBy("CreatedOn", false).filter("IsDraft eq '0'").get()
    return response;
  } catch(err) {
    console.log(err)
  }
}

