import React from 'react';
import './filecard.css';
import { Typography } from 'antd';
import moment from 'moment';
import UserColumnInTable from '../../Global/UserColumnInTable/UserColumnInTable';


function formatSizeUnits(bytes){
  if      (bytes >= 1000000000) { bytes = (bytes / 1000000000).toFixed(2) + " GB"; }
  else if (bytes >= 1000000)    { bytes = (bytes / 1000000).toFixed(2) + " MB"; }
  else if (bytes >= 1000)       { bytes = (bytes / 1000).toFixed(2) + " KB"; }
  else if (bytes > 1)           { bytes = bytes + " bytes"; }
  else if (bytes == 1)          { bytes = bytes + " byte"; }
  else                          { bytes = "0 bytes"; }
  return bytes;
}

const FileCardRow = ({ 
  icon, 
  name, 
  creatorName, 
  creatorEmail, 
  createdDate, 
  modifiedDate, 
  filePath, 
  fileSize,
  sizeType, 
  customColumns, 
  isFolder, 
  onClick,
  canOpen
}) => {


    const columns = customColumns || {
    icon: true,
    name: true,
    createdDate: true,
    modifiedDate: false,
    creator: true,
    size: true,
  };
  return (
      <div className='file-card file-row' onClick={isFolder && canOpen ? (e) => onClick(e) : null}>
        {columns.icon && <div style={{fontSize: '1.2rem', marginRight: '12px'}}>{icon}</div>}
        {columns.name && <Typography.Title level={5} style={{fontWeight: '400', width: '42%'}} onClick={() => filePath && !canOpen ? window.open(filePath): null}>{name}</Typography.Title>}
        {columns.createdDate && <Typography.Text type='secondary' style={{width: '18%'}}>{createdDate ? moment(createdDate).format('MM/DD/YYYY hh:mm') : ''}</Typography.Text>}
        {columns.modifiedDate && <Typography.Text type='secondary' style={{width: '18%'}}>{modifiedDate ? moment(modifiedDate).format('MM/DD/YYYY hh:mm') : ''}</Typography.Text>}
        {columns.creator && <div style={{width: '25%'}}>
          <UserColumnInTable Mail={creatorEmail} DisplayName={creatorName} />
        </div>}
        {columns.size && <Typography.Text type='secondary' style={{width: '12%'}}>{sizeType === "size" ? (fileSize != 0 ? formatSizeUnits(fileSize) : '') : sizeType === "items" ? (sizeType != 0 ? `${fileSize} Item` : 'No Items') : ''}</Typography.Text>}
      </div>
  )
}

export default FileCardRow