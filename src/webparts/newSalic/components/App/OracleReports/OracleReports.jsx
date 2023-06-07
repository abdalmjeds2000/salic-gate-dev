import React, { useContext, useEffect, useState } from 'react';
import "./OracleReports.css";
import { AppCtx } from '../App';
import axios from 'axios';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import { CaretDownOutlined, CaretRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Col, message, Row, Spin, Typography } from 'antd';
import { MdOutlineFileCopy } from 'react-icons/md'
import { HiExternalLink } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';



function flattenTreeData(treeData, flatData = []) {
  treeData.forEach(node => {
    flatData.push(node);
    if (node?.children?.length !== 0) {
      flattenTreeData(node.children, flatData);
    }
  });
  return flatData;
}




const OracleReports = () => {
  const navigate = useNavigate();
  const {user_data, defualt_route} = useContext(AppCtx);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = React.useState(true);
  const [oracleReports, setOracleReports] = React.useState(true);
  const [selectedFolder, setSelectedFolder] = React.useState({});

  // Get Oracle Reports Data
  const fetchData = async () => {
    setLoading(true);
    
    const response = await axios.get(`https://dev.salic.com/api/reports/get?Email=${user_data.Data.Mail}`)
    const _d = JSON.parse(response.data.Data);
    setOracleReports(_d);
    const fD = flattenTreeData(_d?.children);
    console.log('fD', fD);

    setLoading(false);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      fetchData();
    }
  }, [user_data]);



  console.log('expanded', expanded);
  const handleExpand = (id) => {
    setExpanded({ ...expanded, [id]: !expanded[id] });
  };

  // defualt expand first level
  useEffect(() => {
    console.log("oracleReports?.children", oracleReports?.children);
    if(oracleReports?.children) {
      oracleReports.children?.forEach(child => {
        console.log("child", child);
        setExpanded(prev => ({ ...prev, [child.id]: true }));
      });
    }
  }, [oracleReports])
  const renderChildren = (children) => {
    if(!children) {
      return null;
    }
  
    return (
      <ul>
        {children?.map((child, i) => (
          child.IsFolder && <li key={i} className={`reports-node reports-node-level-${child?.Level}`}>
              <button type='button' onClick={(e) => {e.preventDefault(); handleExpand(child.id);}}>
                {
                  child?.children?.filter(c => c.IsFolder)?.length > 0
                    ? expanded[child.id] ? <CaretDownOutlined /> : <CaretRightOutlined />
                    : null
                }
              </button>
              <a 
                className={child.id === selectedFolder.id ? "active" : ""} 
                onClick={() => {
                  if(child?.children?.filter(c => c.IsFolder)?.length > 0) {
                    handleExpand(child.id);
                  } else {
                    child.id !== selectedFolder.id ? setSelectedFolder(child) : null
                  }
                }}>{child.Text}</a>
            {expanded[child.id] && renderChildren(child.children)}
          </li>
        ))}
      </ul>
    )
  }


  return (
    <>
      <HistoryNavigation>
        <p>Oracle Reports</p>
      </HistoryNavigation>
      <div className='standard-page'>
        <div className='oracle-reports-container'>
          <div className='nav-section'>
            {renderChildren(oracleReports?.children)}
          </div>

          <div className='links-section'>
            <div className='header'>
              <Typography.Text style={{ fontSize: "1.4rem" }}>
                {loading && <Spin indicator={<LoadingOutlined spin style={{fontSize: '1rem', color: 'var(--main-color)', marginRight: 7 }} />} />}
                <span>{selectedFolder?.Text} Reports</span>
              </Typography.Text>
              <Button type='primary' onClick={() => navigate(defualt_route + "/manage-oracle-reports")}>
                Manage
              </Button>
            </div>

            <div className='links'>
              <Row gutter={[15, 15]}>
                {
                  selectedFolder?.children?.map((link, i) => (
                    <Col sm={12} md={8} xxl={6}>
                      <div className='box' key={i}>
                        <HiExternalLink style={{ fontSize: "30px", minWidth: "30px", color: "var(--link-text-color)" }} />
                        <h3>
                          <a href={link.Link} target="_blank">{link.Text}</a>
                        </h3>
                        <span onClick={() => {
                          navigator.clipboard.writeText(link.Link)
                          message.success("Link copied")
                        }}>
                          <MdOutlineFileCopy />
                        </span>
                      </div>
                    </Col>
                  ))
                }
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OracleReports