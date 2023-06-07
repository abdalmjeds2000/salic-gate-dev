import React, { useContext, useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Row, Segmented, Typography } from 'antd';
import { AppCtx } from '../../../App';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import FileCard from '../../../Global/FileCard/FileCard';
import FileIcon from '../../../Global/RequestsComponents/FileIcon';
import { AppstoreOutlined, ArrowLeftOutlined, BarsOutlined } from '@ant-design/icons';
import FileCardRow from '../../../Global/FileCard/FileCardRow';


function SharedWithMe() {
  const { sp_context } = useContext(AppCtx);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [viewMode, setViewMode] = useState('Cards');

  const fetchRoot = async () => {
    setLoading(true);
    let items = await sp_context.msGraphClientFactory
      .getClient('3')
      .then((client) => {
        client
          .api('/me/drive/sharedWithMe')
          .get()
          .then((response) => setData(response.value))
          .then(() => setLoading(false))
          .catch(err => console.log(err))
      }).catch(err => console.log(err));
  }


  const fetchChildren = async (driveId, itemId, isback) => {
    setLoading(true);
    if(driveId && itemId){
      let items = await sp_context.msGraphClientFactory
      .getClient('3')
      .then((client) => {
        client
          .api(`/drives/${driveId}/items/${itemId}/children`)
          .get()
          .then((response) => setData(response.value))
          .then(() => setLoading(false))
          .catch(err => console.log(err))
      }).catch(err => console.log(err));
    }
    if(!isback) {
      setHistory(prev => {
        return [...prev, {
          driveId: driveId, 
          itemId: itemId
        }]
      })
    }
  }

  const handleBack = () => {
    console.log('historywithoutcurrent', historywithoutcurrent);
    const last = historywithoutcurrent[historywithoutcurrent.length-1];
    setHistory(prev => prev.filter(row => row.itemId != last.itemId));
    fetchChildren(last.driveId, last.itemId, true)
  }

  useEffect(() => {
    document.title = '.:: SALIC Gate | Shared With Me ::.';
    fetchRoot();
  }, []);


  let historywithoutcurrent = history?.slice(0, -1);

  return (
    <div style={{padding: '20px'}}>
      <Row align="middle" justify="space-between" style={{marginBottom: 15}}>
        <Breadcrumb style={{fontSize: '1.2rem'}}>
          <Breadcrumb.Item onClick={fetchRoot}><a>Shared With Me</a></Breadcrumb.Item>
        </Breadcrumb>
        <Segmented
          onChange={value => setViewMode(value)}
          defaultValue="Cards"
          options={[
            {label: 'List', value: 'List', icon: <BarsOutlined />}, 
            {label: 'Cards', value: 'Cards', icon: <AppstoreOutlined />}
          ]} 
        />
      </Row>
      <Row style={{marginBottom: 10}}>
        {historywithoutcurrent.length != 0 && <Button size='small' type='link' onClick={handleBack}><ArrowLeftOutlined /> Back</Button>}
      </Row>
      
      {loading ? <AntdLoader customStyle={{margin: '25px'}} /> : null}

      <div>
        {
          viewMode === "Cards"
          ? (
            <Row gutter={[20, 20]} justify="start">
              {
                data.map((row, i) => {
                  return (
                    <Col key={i} xs={24} sm={12} md={12} lg={6} xl={4} xxl={4}>
                    <FileCard
                      icon={<FileIcon FileType={row.folder ? 'folder' : row.name?.split('.')[row.name?.split('.')?.length-1]} FileName={row.name} IconWidth={40} />}
                      name={row.name}
                      creatorName={row.createdBy?.user?.displayName}
                      createdDate={row.createdDateTime}
                      FilePath={row.webUrl}
                      isFolder={row.folder}
                      canOpen={row.folder ? true : false}
                      onClick={e => fetchChildren(row.remoteItem?.parentReference?.driveId || row.parentReference?.driveId, row.id)}
                    />
                    </Col>
                  )
                })
              }
            </Row>
          ) : (
            <Row gutter={[0, 8]} justify="center" style={{overflow: 'auto'}}>
              <Col span={24} style={{padding: '5px 10px 5px 62px', minWidth: '650px', display: 'flex', alignItems: 'center'}}>
                <Typography.Text type='secondary' style={{width: '43.3%'}}>Name</Typography.Text>
                <Typography.Text type='secondary' style={{width: '18.4%'}}>Created At</Typography.Text>
                <Typography.Text type='secondary' style={{width: '26%'}}>Shared By</Typography.Text>
                <Typography.Text type='secondary' style={{width: '12%'}}>Size</Typography.Text>
              </Col>
              {
                data.map((row, i) => {
                  return (
                    <Col key={i} span={24}>
                      <FileCardRow
                        icon={<FileIcon FileType={row.folder ? 'folder' : row.name?.split('.')[row.name?.split('.')?.length-1]} FileName={row.name} IconWidth={40} />}
                        name={row.name}
                        creatorName={row.createdBy?.user?.displayName}
                        creatorEmail={null}
                        createdDate={row.createdDateTime}
                        filePath={row.webUrl}
                        sizeType={row.folder ? "items" : "size"}
                        fileSize={row.folder ? row.folder.childCount : row.size}
                        isFolder={row.folder}
                        canOpen={row.folder ? true : false}
                        onClick={e => fetchChildren(row.remoteItem?.parentReference?.driveId || row.parentReference?.driveId, row.id)}
                      />
                    </Col>
                  )
                })
              }
            </Row>
          )
        }
        
      </div>
    </div>
  )
}

export default SharedWithMe