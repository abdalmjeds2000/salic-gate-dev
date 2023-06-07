import pnp from 'sp-pnp-js';

const GetSiteUsers = () => pnp.sp.web.siteUsers.get()
    .then((res) => {
        console.log(res)
        return res.filter(u => !u.IsHiddenInUI && u.Email)
    })
    .catch((err) => console.log(err));

    

export default GetSiteUsers