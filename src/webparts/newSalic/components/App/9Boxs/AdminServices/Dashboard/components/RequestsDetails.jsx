import React from 'react';
import { Tooltip, Typography } from 'antd';


const getAdminName = (name) => {
  return (
    name === 'VISA' ? 'Issue VISA' 
    : name === 'BusinessGates' ? 'Business Gates' 
    : name === 'Shipment' ? 'Shipment' 
    : name === 'OfficeSupplies' ? 'Office Supplies' 
    : name === 'Maintenance' ? 'Maintenance' 
    : name === 'Visitors' ? 'Visitors' 
    : name === 'Transportations' ? 'Transportations' 
    : '-'
  );
}
const getAdminBEName = (name) => {
  return (
    name === 'VISA' ? 'VISA' 
    : name === 'BusinessGates' ? 'Business Gate' 
    : name === 'Shipment' ? 'Shipment Request' 
    : name === 'OfficeSupplies' ? 'Office Supply' 
    : name === 'Maintenance' ? 'Maintenance Request' 
    : name === 'Visitors' ? 'Visitor VISA' 
    : name === 'Transportations' ? 'Transportation Gate' 
    : '-'
  );
}
const getAdminColorByName = (name) => {
  return (
    name === 'VISA' ? '#43a2cc' 
    : name === 'BusinessGates' ? '#f7937b' 
    : name === 'Shipment' ? '#bbbbee' 
    : name === 'OfficeSupplies' ? '#97dcfa' 
    : name === 'Maintenance' ? '#70cfaf' 
    : name === 'Visitors' ? '#fd96a6' 
    : name === 'Transportations' ? '#fbbe82' 
    : '#5B8FF9'
  );
}
const RequestCard = ({ name, reqTypes, selectdRequests, toggleSelect }) => {
  const totalCount = reqTypes?.reduce((count, obj) => count + obj.Count, 0);
  const completedCount = reqTypes?.filter(item => item.Key === "FIN")[0]?.Count;
  const incompleted = totalCount - completedCount;
  return (
    <div 
      onClick={() => toggleSelect(getAdminBEName(name))} 
      style={{ 
        cursor: "pointer", 
        height: "100%",
        padding: 15, borderRadius: 5, 
        backgroundColor: `${getAdminColorByName(name)}12`, 
        border: `3px solid ${getAdminColorByName(name)}40`, 
        marginBottom: 15, 
        filter: selectdRequests.find(itm => itm === getAdminBEName(name)) ? "none" : "grayscale(1)"}}>
      <div style={{ lineHeight: 1 }}>
        <Typography.Text title='Total Request' style={{ userSelect: "none", fontSize: "2rem", fontWeight: "700", color: "#333", margin: "0 10px 0 5px" }}>
          {totalCount.toLocaleString("en-US")}
        </Typography.Text>
        <Typography.Text style={{ fontSize: "1rem" }}>{getAdminName(name)}</Typography.Text>
      </div>
      <div>
        <div style={{ textAlign: "end" }}>
          <Typography.Text strong>{`${Math.round((completedCount/totalCount)*100)}%`}</Typography.Text>
        </div>
        <div style={{ display: "flex", height: "17px", backgroundColor: "#eee", position: "relative", borderRadius: 1, overflow: "hidden" }}>
          <Tooltip title={`Completed: ${completedCount.toLocaleString("en-US")}`}>
            <div
              style={{
                height: "100%", width: `${(completedCount/totalCount)*100}%`,
                backgroundColor: getAdminColorByName(name),
              }}
            />
          </Tooltip>
          <Tooltip title={`Incomplete: ${incompleted.toLocaleString("en-US")}`}>
            <div
              style={{
                height: "100%", width: `${(incompleted/totalCount)*100}%`, minWidth: incompleted > 0 ? 30 : 0,
                backgroundColor: `${getAdminColorByName(name)}55`,
              }}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  )
};



const RequestsDetails = ({ data, selectdRequests, toggleSelect }) => {

  const cardsRender = (
    Object.keys(data).map(key => (
      <RequestCard key={key} name={key} reqTypes={data[key]} selectdRequests={selectdRequests} toggleSelect={toggleSelect} />
    ))
  );

  return (
    <div style={{ borderRadius: "12px", backgroundColor: "#fafafa", border: "1px solid #eee", padding: "10px 20px" }}>
      <div>
        <Typography.Text strong style={{fontSize: '1.5rem', display: "block", marginBottom: 15}}>Requests Details</Typography.Text>
      </div>
      <div>
        {cardsRender}
      </div>
    </div>
  )
}

export default RequestsDetails