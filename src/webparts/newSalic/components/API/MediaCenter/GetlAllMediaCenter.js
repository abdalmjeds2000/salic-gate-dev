import pnp from 'sp-pnp-js';

const GetlAllMediaCenter = () => pnp.sp.web.lists.getByTitle('MediaCenter').renderListDataAsStream({
    ViewXml: `<View Scope=\"RecursiveAll\"><Query><Where><And><In><FieldRef Name=\"DocIcon\"/><Values><Value Type=\"Computed\">jpg</Value><Value Type=\"Computed\">mp4</Value><Value Type=\"Computed\">avi</Value><Value Type=\"Computed\">png</Value><Value Type=\"Computed\">gif</Value><Value Type=\"Computed\">bmp</Value></Values></In><Eq><FieldRef Name=\"ContentType\" /><Value Type=\"ContentType\">Document</Value></Eq></And></Where></Query></View>`
    }).then((res) => {
        return res
    })
    .catch((err) => console.log(err));


export default GetlAllMediaCenter

