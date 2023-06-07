import React, { useContext, useEffect, useState } from 'react';
import { Breadcrumb, Col, Row, Segmented, Typography } from 'antd';
import { AppCtx } from '../../../App';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';
import FileCard from '../../../Global/FileCard/FileCard';
import FileIcon from '../../../Global/RequestsComponents/FileIcon';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import FileCardRow from '../../../Global/FileCard/FileCardRow';


function PrivateFolder() {
  const { sp_context } = useContext(AppCtx);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('Cards');
  const [breadcrumb, setBreadcrumb] = useState([]);


  const fetchRoot = async () => {
    setLoading(true);
    let items = await sp_context.msGraphClientFactory
      .getClient('3')
      .then((client) => {
        client
          .api(`/me/drive/root/children`)
          .get()
          .then((response) => {setData(response.value); setBreadcrumb([]);})
          .then(() => setLoading(false))
          .catch(err => console.log(err))
      }).catch(err => console.log(err))
  }
  const fetchChildren = async (path) => {
    setLoading(true);
    let items = await sp_context.msGraphClientFactory
      .getClient('3')
      .then((client) => {
        client
          .api(`/me/drive/root${path ? ':/' + path + ':' : ''}/children`)
          .get()
          .then((response) => {
            setData(response.value);
            setBreadcrumb(prev => {
              const splitPath = path.slice(1, -1);
              const newlink = {key: splitPath?.split('/').length, title: path?.split('/')[path?.split('/')?.length-1], path: path};
              console.log();
              let filteredData = prev.filter(row => row.key < newlink.key);
              return [...filteredData, newlink];
            });
          })
          .then(() => setLoading(false))
          .catch(err => console.log(err))
      }).catch(err => console.log(err))
  }

  useEffect(() => {
    document.title = '.:: SALIC Gate | My Files ::.';
    fetchRoot();
  }, []);

  return (
    <div style={{padding: '20px'}}>
      <Row align="middle" justify="space-between" style={{marginBottom: 10}}>
        <Breadcrumb style={{fontSize: '1.2rem'}}>
          <Breadcrumb.Item onClick={fetchRoot}><a>My Files</a></Breadcrumb.Item>
          {breadcrumb?.map(({title, path}) => <Breadcrumb.Item onClick={() => fetchChildren(path)}><a>{title}</a></Breadcrumb.Item>)}
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
      {loading ? <AntdLoader customStyle={{margin: '25px'}} /> : null}
      <div>
        {
          viewMode === "Cards"
          ? (
            <Row gutter={[20, 20]}>
              {
                data?.map((row, i) => {
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
                      onClick={e => fetchChildren(row.parentReference?.path?.replace('/drive/root:', '') + "/" + row.name)}
                    />
                    </Col>
                  )
                })
              }
            </Row>
          ) : (
            <Row gutter={[0, 8]} justify="center" style={{overflow: 'auto'}}>
              <Col span={24} style={{padding: '5px 10px 5px 62px', minWidth: '650px', display: 'flex', alignItems: 'center'}}>
                <Typography.Text type='secondary' style={{width: '45%'}}>Name</Typography.Text>
                <Typography.Text type='secondary' style={{width: '19.5%'}}>Created At</Typography.Text>
                <Typography.Text type='secondary' style={{width: '19.5%'}}>Last Modified</Typography.Text>
                <Typography.Text type='secondary' style={{width: '12%'}}>Size</Typography.Text>
              </Col>
              {
                data?.map((row, i) => {
                  return (
                    <Col key={i} span={24}>
                      <FileCardRow
                        icon={<FileIcon FileType={row.folder ? 'folder' : row.name?.split('.')[row.name?.split('.')?.length-1]} FileName={row.name} IconWidth={40} />}
                        name={row.name}
                        creatorName={row.createdBy?.user?.displayName}
                        createdDate={row.createdDateTime}
                        modifiedDate={row.lastModifiedDateTime}
                        filePath={row.webUrl}
                        sizeType={row.folder ? "items" : "size"}
                        fileSize={row.folder ? row.folder.childCount : row.size}
                        customColumns={{ icon: true, name: true, createdDate: true, modifiedDate: true, creator: false, size: true,}}
                        isFolder={row.folder}
                        canOpen={row.folder ? true : false}
                        onClick={e => fetchChildren(row.parentReference?.path?.replace('/drive/root:', '') + "/" + row.name)}
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

export default PrivateFolder