import React, { useContext, useEffect, useState } from 'react';
import "./ManageOracleReports.css";
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../App';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import axios from 'axios';
import { Spin, Tree, Typography } from 'antd';
import DeleteAction from './actions/DeleteAction';
import AddChildAction from './actions/AddChildAction';
import UpdateItem from './actions/UpdateItem';
import { LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function flattenTreeData(treeData, flatData = []) {
  treeData.forEach(node => {
    flatData.push(node);
    if (node?.children?.length !== 0) {
      flattenTreeData(node.children, flatData);
    }
  });
  return flatData;
}


const ManageOracleReports = () => {
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [adminsData, setAdminsData] = useState({});
  const [flatData, setFlatData] = useState([]);
  const [selectedNode, setSelectedNode] = useState({});
  
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://dev.salic.com/api/reports/getAdmin");
      if(response.status == 200 && response?.data?.Status === 200) {
        const _d = JSON.parse(response?.data?.Data);
        setAdminsData(_d);
        const flatData_ = flattenTreeData(_d?.children);
        setFlatData(flatData_);
      }
    } catch(err) {
      console.log(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAdmins();
  }, []);



  const onSelect = (selectedKeys, info) => {
    if(selectedKeys && selectedKeys?.length) {
      setSelectedNode(info?.node || {});
    }
  }


  const onDelete = () => {
    fetchAdmins();
    setSelectedNode({});
  }
  const onAddChild = () => {
    fetchAdmins();
    setSelectedNode({});
  }
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + "/oracle-reports")}>Oracle Reports</a>
        <p>Manage</p>
      </HistoryNavigation>

      <div className='standard-page'>
        <div className='manage-oracle-reports-container'>
          <div className='tree-section'>
            <Tree
              showLine={true}
              onSelect={onSelect}
              fieldNames={{ title: "Text", key: "id", children: "children" }}
              style={{ backgroundColor: "transparent" }}
              treeData={adminsData.children}
            />
          </div>


          <div className='manage-section'>
            {/* header */}
            <div className='header'>
              <Text style={{ fontSize: "1.4rem" }}>
                {loading && <Spin indicator={<LoadingOutlined spin style={{fontSize: '1rem', color: 'var(--main-color)', marginRight: 7 }} />} />}
                {
                  selectedNode?.Text 
                    ? <><Text strong>{selectedNode?.Text}</Text> Options</> 
                    : "SALIC Oracle Reports"
                }
              </Text>

              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <AddChildAction parentId={selectedNode?.id} onFinish={onAddChild} byEmail={user_data?.Data?.Mail} isRoot />
                {selectedNode?.id && 
                  <AddChildAction parentId={selectedNode?.id} onFinish={onAddChild} byEmail={user_data?.Data?.Mail} />}
                {selectedNode?.id && <DeleteAction id={selectedNode?.id} onFinish={onDelete} />}
              </div>
            </div>
            
            <div className='update-form'>
              <UpdateItem item={selectedNode} folders={flatData?.filter(f => f.IsFolder)} onFinish={fetchAdmins} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ManageOracleReports