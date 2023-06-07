import React, { useEffect, useState } from 'react';
import './Tabs.css';
import AntdLoader from '../AntdLoader/AntdLoader';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const Tabs = ({items, loading, bodyStyle, rightOfTabs}) => {
  let navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(items[0]?.key || 1);

  useEffect(() => {
    // const goFirst = navigate(document.location.pathname + "#" + activeTab, { replace: true });
    const hash = document.location.hash.split("#").filter(a => a && a !== "")[0];

    if(!hash) { // goFirst
      navigate(document.location.pathname + "#" + activeTab, { replace: true });
    } else {
      const newActiveTab = Number(hash);
      if(!isNaN(newActiveTab)) {
        if(newActiveTab <= items.length) {
          // goFirst
          navigate(document.location.pathname + "#" + hash, { replace: true });
          setActiveTab(newActiveTab);
          // goFirst
        } else navigate(document.location.pathname + "#" + activeTab, { replace: true });
      } else {
        // goFirst
        navigate(document.location.pathname + "#" + activeTab, { replace: true });
      }
    }
  }, [])
  return (
    <div className='custom-tabs-container'>
      <div className='tabbable-panel'>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <ul className="tab-container">
            {
              items?.map((item, i) => (
                <Tooltip title={item.title} mouseEnterDelay={0.7}>
                  <a
                    onClick={e => {
                      e.preventDefault()
                      navigate(document.location.pathname + `#${item.key}`, { replace: true })
                    }}
                  >
                    <li key={i} onClick={() => setActiveTab(item.key)} className={activeTab == item.key ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {item.loading ? <LoadingOutlined /> : item.icon} 
                      {(!item.icon && activeTab !== item.key) ? <span className='instead-icon'>{item.key}</span> : null }
                      <span className='title'>{item.title}</span>
                    </li>
                  </a>
                </Tooltip>
              ))
            }
          </ul>
          <div>{rightOfTabs}</div>
        </div>
        <div className='tab-content' style={bodyStyle}>
          {
            !loading
            ? (
                items.map((item, i) => (
                  <div key={i} style={{display: activeTab != item.key ? 'none' : ''}}>
                    {item.content}
                  </div>
                ))
              ) : <AntdLoader />
          }
        </div>
      </div>
    </div>
  )
}

export default Tabs