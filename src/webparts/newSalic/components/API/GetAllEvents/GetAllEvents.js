import pnp from 'sp-pnp-js';

const GetAllEvents = () => pnp.sp.web.lists.getByTitle('Saudi Arabia Events').items.orderBy("Date", false).get()
    .then((res) => {
        return res
    })
    .catch((err) => console.log(err));

export default GetAllEvents;