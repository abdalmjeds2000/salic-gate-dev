import React, { useContext } from 'react';
import { Card, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import UserColumnInTable from '../../../../Global/UserColumnInTable/UserColumnInTable';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../../App';


const CardTitle = (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
    <Typography.Text strong style={{fontSize: '1.2rem'}}>Latest Requests</Typography.Text>
    {/* <Typography.Link href='https://devsalic.sharepoint.com/sites/Portal/SitePages/Home.aspx/admin-services/assigned-requests' target='_blank'>See All</Typography.Link> */}
  </div>
);


const LatestRequests = ({ data }) => {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  const ToUpdatePage = (RequestType, RequestId) => {
    const Code = RequestType.split("-")[0];
    if(Code === "VISA") {
      navigate(defualt_route + `/admin-services/issuing-VISA/${RequestId}`);
    } else if(Code === "BG") {
      navigate(defualt_route + `/admin-services/business-gate/${RequestId}`);
    } else if(Code === "SHP") {
      navigate(defualt_route + `/admin-services/shipment/${RequestId}`);
    } else if(Code === "SUP") {
      navigate(defualt_route + `/admin-services/office-supply/${RequestId}`);
    } else if(Code === "MAN") {
      navigate(defualt_route + `/admin-services/maintenance/${RequestId}`);
    } else if(Code === "VIS") {
      navigate(defualt_route + `/admin-services/visitor/${RequestId}`);
    } else if(Code === "TS") {
      navigate(defualt_route + `/admin-services/transportation/${RequestId}`);
    }
    return null
  }

  const columns = [
    {
      title: '#Id',
      dataIndex: 'Id',
      width: '5%',
      render: (value, record) => <div style={{ minWidth: 45 }}><a onClick={() => ToUpdatePage(record.ReferenceCode, record.Id)}>{value}</a></div>
    },
    {
      title: 'Ref. Code',
      dataIndex: 'ReferenceCode',
      render: (code, record) => (
        <div style={{ minWidth: 160 }}>
          <a onClick={() => ToUpdatePage(code, record.Id)}>
            {
              record?.Status !== "FIN" && moment(moment()).diff(record.CreatedAt, 'days') >= 2
                ? <span style={{ userSelect: "none", fontSize: "2.5rem", lineHeight: 0, position: "relative", top: 7, color: "var(--brand-orange-color)"}}>•</span>
                : null
            }
            {code}
          </a>
        </div>
      )
    },
    {
      title: 'Name',
      dataIndex: 'ApplicationName',
      render: (value, record) => <div style={{ minWidth: 120 }}><a onClick={() => ToUpdatePage(record.ReferenceCode, record.Id)}>{value}</a></div>
    },
    {
      title: 'Created',
      dataIndex: 'CreatedAt',
      render: (value) => <div style={{ minWidth: 140 }}>{moment(value).format("MM/DD/YYYY HH:mm A")}</div>
    },
    {
      title: 'Requester',
      dataIndex: 'ByUser',
      render: (val) => val ? <UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /> : '-'
    },
    {
      title: 'By',
      dataIndex: 'ToUser',
      render: (val) => val ? <UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /> : '-'
    },
    // {
    //   title: 'Processing Status',
    //   dataIndex: '',
    //   render: (_, record) => (
    //     <div style={{ minWidth: 120 }}>
    //       {
    //         record?.Status !== "FIN" &&
    //         moment(moment()).diff(record.CreatedAt, 'days') >= 2
    //           ? <Tag color="warning">Delayed</Tag>
    //         : record?.Status === "FIN"
    //           ? <Tag color="success">On Time</Tag>
    //         : null
    //       }
    //     </div>
    //   ),
    // },
    {
      title: 'Closed Date',
      dataIndex: 'Date',
      render: (value, record) => record.Status === "FIN" ? <div style={{ minWidth: 140 }}>{moment(value).format("MM/DD/YYYY HH:mm A")}</div> : null
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      render: (value) => <div>{value === "FIN" ? "Closed" : value === "ACTION" ? "Pending" : value}</div>
    },
  ];

  return (
    <div>
      <Card bodyStyle={{ padding: 0, overflowX: "auto" }} title={CardTitle}>
        <Table columns={columns} dataSource={data} size="small" pagination={false} />
      </Card>
    </div>
  )
}

export default LatestRequests