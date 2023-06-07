import pnp from 'sp-pnp-js';

const GetAllNews = () => pnp.sp.web.lists.getByTitle('News').items.select('Author/Title,Author/EMail,Author/JobTitle,Subject,Photos,Id,ID,IsDraft,Description,CreatedOn,Created,IsPerson,AttachmentFiles').expand('Author,AttachmentFiles').top(500).orderBy("CreatedOn", false).get()
    .then((res) => {
        return res
    })
    .catch((err) => console.log(err));

export default GetAllNews