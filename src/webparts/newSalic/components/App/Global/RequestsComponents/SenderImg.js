import React, { useContext } from 'react';
import { Avatar, Image } from "antd";
import { AppCtx } from '../../App';

const SenderImg = (props) => {
    const { sp_site } = useContext(AppCtx);

    return (
        <Avatar
            src={
                <Image
                    src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${props.Email}`}
                    preview={{src: `${sp_site}/_layouts/15/userphoto.aspx?size=L&username=${props.Email}`,}}
                    style={{minWidth: 32}}
                    title={props.Name || ''}
                    alt=''
                />
            }
        />
    )
}

export default SenderImg