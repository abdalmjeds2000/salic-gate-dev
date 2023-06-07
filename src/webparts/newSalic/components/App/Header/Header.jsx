import React, { useContext, useState } from "react";
import './Header.css';
import logo from '../../../assets/images/logo.jpg';
import VisionLogo from '../../../assets/images/2030-vision-logo-dark.svg';
import { useNavigate } from "react-router-dom";
import { AppCtx } from "../App";
import SpSearch from "./Search/SpSearch";
import { Button, Input, Tooltip } from "antd";
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";

const Navbar = (props) => {
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx)
  const [showSearch, setShowSearch] = useState(true);
  const [value, setValue] = useState('');
  const [toggleSearch, setToggleSearch] = useState(false);
  const onchangeQuery = (value) => {
    if(value.length === 0) {
      setToggleSearch(false);
    }
    setValue(value);
  }
  return ( 
    <div className="navbar" style={props.style}>

      {/* Header Search INPUT */}
      {
        showSearch ? (
        <div className="sp-search-input" style={{ top: toggleSearch ? "50%" : "-20px" }}>
          <Input.Search
            suffix={<SearchOutlined />} 
            enterButton={false}
            placeholder="Search" 
            style={{borderRadius: '7px', overflow: 'hidden', width: '100%'}}
            onChange={e => {
              (async () => {await onchangeQuery(e.target.value)})() 
            }}
          />
        </div>
        ) : (
          null
        )
      }
      {/* Search Result */}
      <SpSearch query={value} setShowSearch={(v) => setShowSearch(v)} />
      
      {/* SALIC Logo */}
      <img src={logo} alt="logo" className="logoSALIC" onClick={() => navigate(defualt_route+'/home')} />

      {/* 2030 Logo */}
      <img src={VisionLogo} alt='2030 Vision Logo' className="logo_2030" />

      {/* To Put User Panel in header right */}


      {/* Toggle Search Btn on Mobile */}
      {
        showSearch ? (
          <span className="toggle-btn-search-mobile">
            <Tooltip title="search" placement="bottomRight">
              <Button type="default" shape="circle" icon={toggleSearch ? <CloseCircleOutlined /> : <SearchOutlined />} onClick={() => setToggleSearch(prev => !prev)} />
            </Tooltip>
          </span>
        ) : (
          null
        )
      }


      {props.children}
      
    </div>
  )
}

export default Navbar