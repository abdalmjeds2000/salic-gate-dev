import pnp from 'sp-pnp-js';

const GetAllNotes = () => pnp.sp.web.lists.getByTitle('Sticky Notes').items.orderBy("CreateAt", false).top(10).get()
    .then((res) => {
        return res
    })
    .catch((err) => console.log(err));


export default GetAllNotes