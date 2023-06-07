import { Avatar, Image } from 'antd';
import React, { useContext } from 'react';
import { AppCtx } from '../../App';


const UserColumnInTable = (props) => {
    const { sp_site } = useContext(AppCtx);

    return (
        <div style={{display: 'flex', alignItems: 'center', gap: '7px'}}>
            {props.Mail && props.Mail.length > 0 && <Avatar
                src={
                <Image
                    src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${props.Mail}`}
                    preview={{src: `${sp_site}/_layouts/15/userphoto.aspx?size=L&username=${props.Mail}`,}}
                    style={{minWidth: 32}}
                />
                }
            />}
            {props.DisplayName && props.DisplayName.length > 0 && <a 
                href={`https://devsalic.sharepoint.com/_layouts/15/me.aspx/?p=${props.Mail}&v=work`} 
                target='_blank'
                style={{ lineHeight: "1.2" }}
            >
                {props.DisplayName || ' - '}
                {props.NameDescription && <div>{props.NameDescription}</div> }
            </a>}
        </div>
    )
}

export default UserColumnInTable