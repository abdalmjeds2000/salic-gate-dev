import React, { useState } from 'react';
import '../searchStyle.css';
import { Col, Row, Segmented, Typography } from 'antd';
import FileIcon from '../../Global/RequestsComponents/FileIcon';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
const { Text } = Typography;
import FileCard from '../../Global/FileCard/FileCard';
import FileCardRow from '../../Global/FileCard/FileCardRow';







const Result = ({ data, query, totalItems }) => {
  const [viewMode, setViewMode] = useState('Cards');

  return (
    <div style={{marginBottom: 25}}>
      <Row justify="space-between" align="middle" style={{marginBottom: 20}}>
        <Text><b>{totalItems}</b> Result for <Text mark>{query}</Text></Text>
        <Segmented
          onChange={value => setViewMode(value)}
          defaultValue="Cards"
          options={[
            {label: 'List', value: 'List', icon: <BarsOutlined />}, 
            {label: 'Cards', value: 'Cards', icon: <AppstoreOutlined />}
          ]} 
        />
      </Row>

      {viewMode === "Cards" && <Row gutter={[20, 20]} justify="center">
        {
          data?.map((row, i) => {
            const _ContentTypeId = row.Cells.filter(key => key.Key === "ContentTypeId")[0]?.Value;
            const _FileType = row.Cells.filter(key => key.Key === "FileType")[0]?.Value;
            const FileType = _ContentTypeId?.startsWith('0x012000') ? 'folder' : _FileType ;
            const Title = row.Cells.filter(key => key.Key === "Title")[0]?.Value;
            const Author = row.Cells.filter(key => key.Key === "CreatedBy")[0]?.Value?.replace(';', ', ');
            const CreatedDate = row.Cells.filter(key => key.Key === "Created")[0]?.Value;
            const Path = row.Cells.filter(key => key.Key === "Path")[0]?.Value;
            const SiteTitle = row.Cells.filter(key => key.Key === "SiteTitle")[0]?.Value;
            
            return (
              <Col key={i} xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
                <FileCard
                  icon={<FileIcon FileType={FileType} FileName={Title} IconWidth={40} />}
                  name={Title}
                  parent={SiteTitle}
                  creatorName={Author}
                  createdDate={CreatedDate}
                  FilePath={Path}
                />
              </Col>
            )
          })
        }
      </Row>}

      
      {viewMode === "List" && <Row gutter={[0, 8]} justify="center" style={{overflow: 'auto'}}>
        <Col span={24} style={{padding: '5px 10px 5px 62px', minWidth: '650px', display: 'flex', alignItems: 'center'}}>
          <Typography.Text type='secondary' style={{width: '43.3%'}}>Name</Typography.Text>
          <Typography.Text type='secondary' style={{width: '18.4%'}}>Created At</Typography.Text>
          <Typography.Text type='secondary' style={{width: '26%'}}>Creator</Typography.Text>
          <Typography.Text type='secondary' style={{width: '12%'}}>Size</Typography.Text>
        </Col>
        {
          data?.map((row, i) => {
            const _ContentTypeId = row.Cells.filter(key => key.Key === "ContentTypeId")[0]?.Value;
            const FileType = _ContentTypeId?.startsWith('0x012000') ? 'folder' : row.Cells.filter(key => key.Key === "FileType")[0]?.Value;
            const Title = row.Cells.filter(key => key.Key === "Title")[0]?.Value;
            const Author = row.Cells.filter(key => key.Key === "CreatedBy")[0]?.Value?.replace(';', ', ');
            const CreatedDate = row.Cells.filter(key => key.Key === "Created")[0]?.Value;
            const Path = row.Cells.filter(key => key.Key === "Path")[0]?.Value;
            const Size = row.Cells.filter(key => key.Key === "Size")[0]?.Value;
            
            return (
              <Col key={i} span={24}>
                <FileCardRow
                  icon={<FileIcon FileType={FileType} FileName={Title} IconWidth={40} />}
                  name={Title}
                  creatorName={Author}
                  creatorEmail={null}
                  createdDate={CreatedDate}
                  filePath={Path}
                  sizeType={FileType == "folder" ? "items" : "size"}
                  fileSize={FileType == "folder" ? 0 : Size}
                />
              </Col>
            )
          })
        }
      </Row>}
    </div>
  )
}

export default Result