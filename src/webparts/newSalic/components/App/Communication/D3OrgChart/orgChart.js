import React, { useState, useRef, useLayoutEffect, useMemo, useContext, useEffect } from "react";
import { OrgChart } from "d3-org-chart";
// import CustomNodeContent from "./customNodeContent";
// import CustomExpandButton from "./customExpandButton";
import '../Communication.css';
import EmployeeDetailsCard from "./employeeDetailsCard";
import { AiOutlineZoomIn, AiOutlineZoomOut, AiOutlineNodeCollapse } from "react-icons/ai";
import { MdOutlineZoomOutMap, MdOutlineFitScreen } from "react-icons/md";
import { SlOrganization } from "react-icons/sl";
import { Button, Dropdown, Menu, Tooltip } from "antd";
import { TbLayoutBoardSplit } from "react-icons/tb";
import { AppCtx } from "../../App";

const styles = {
  orgChart: {
    height: "calc(100vh - 135px)",
  },
  orgChartToolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    position: 'absolute',
    right: '25px',
    bottom: '50px',
  }
};

const OrganizationalChart = (props) => {
  const { user_data } = useContext(AppCtx);
  const [cardShow, setCardShow] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [layout, setLayout] = useState('left');
  
  const d3Container = useRef(null);
  const chart = useMemo(() => {
    return new OrgChart()
  }, []);

  const handleShow = () => setCardShow(true);
  const handleClose = () => setCardShow(false);



  useLayoutEffect(() => {
    const toggleDetailsCard = (nodeId) => {
      handleShow();
      setEmployeeId(nodeId);
    };
    if (props.data && d3Container.current) {
      chart
        .container(d3Container.current)
        .data(props.data)
        .parentNodeId(d => d.pid)
        .expandLevel(19)
        .nodeWidth((d) => {
          if(d.data.id == "0") {
            return 120
          } else if(d.data.id == "1") {
            return 340
          }
          return 300
        })
        .nodeHeight((d) => {
          if(d.data.id == "0") {
            return 120
          } else if(d.data.id == "1") {
            return 175
          }
          return 150
        })
        .compactMarginBetween((d) => 80)
        .layout(layout)
        .onNodeClick((d) => {
          if(d != "0") {
            toggleDetailsCard(d);
          }
        })
        // .initialZoom(0.35)
        .nodeContent((d) => {
          const dd = d.data;
          dd.depth = d.depth;
          const colors = [
            '#0c508c',
            // '#4098ff',
            '#3a9bcc',
            '#8540b8',
            '#e26565',
            '#75be68',
            '#e99b4d',
            '#e05d2b',
            '#4098ff',
          ];
          // const color = colors[d.depth-1 % colors.length];
          const color = colors[d.depth % colors.length];
          let isMe = false;
          if(Object.keys(user_data).length > 0) {
            isMe = user_data.Data?.Mail === d.data?.email;
          }
          const n = {...d};
          return `
              <div class="node-container" style="background-color: ${color}; border: ${isMe ? '10px solid #00000073' : '0 6px 10px rgb(0 0 0 / 6%)'}" id="${n.id}">
                <div class="node-content">
                  <img class="node-img" src="${n.data.img}" alt="" />
                  <div class="job-title">${n.data.title || ''}</div>                  
                </div>
                <div class="name">${n.data.name || ''}${n.data.INDEX || ''}</div>
              </div>
          `
        })
        // .buttonContent((node, state) => {
        //   return ReactDOMServer.renderToStaticMarkup(
        //     <CustomExpandButton {...node.node} />
        //   );
        // })
        // .nodeContent((d) => {
        //   return ReactDOMServer.renderToStaticMarkup(
        //     <CustomNodeContent {...d} />
        //   );
        // })
        .render();
    }
  }, [chart, props, props.data, layout]);


  var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
  useEffect(() => {
    if(props.data.length > 0) {
      if(mobile) {
        setLayout('top');
      } else {
        setLayout('left');
      }
    }
  }, [])
  useEffect(() => {
    chart.fit();
  }, [layout])


  const menu = (
    <Menu
      items={[
        { onClick: () => {setLayout('left'); }, label: 'Left', key: 'left' },
        { onClick: () => {setLayout('right'); }, label: 'Right', key: 'right' },
        { onClick: () => {setLayout('top'); }, label: 'Top', key: 'top' },
        { onClick: () => {setLayout('bottom'); }, label: 'Bottom', key: 'bottom' },
      ]}
    />
  );
  

  const toolbarBtnStyle = {
    width: '35px',
    height: '35px',
    backgroundColor: 'var(--main-color)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
  }
  return (
    <div style={styles.orgChart} ref={d3Container}>
      <div style={styles.orgChartToolbar}>
        <Tooltip title="Zoom In" placement="left">
          <Button style={toolbarBtnStyle} type="primary" shape="circle" onClick={() => chart.zoomIn()}><AiOutlineZoomIn /></Button>
        </Tooltip>
        <Tooltip title="Zoom Out" placement="left">
          <Button style={toolbarBtnStyle} type="primary" shape="circle" onClick={() => chart.zoomOut()}><AiOutlineZoomOut /></Button>
        </Tooltip>
        <Tooltip title="Full Screen" placement="left">
          <Button style={toolbarBtnStyle} type="primary" shape="circle" onClick={() => {chart.fullscreen(); chart.fit();}}><MdOutlineZoomOutMap /></Button>
        </Tooltip>
        <Tooltip title="Expand All" placement="left">
          <Button style={toolbarBtnStyle} type="primary" shape="circle" onClick={() => {chart.expandAll(); chart.fit();}}><SlOrganization /></Button>
        </Tooltip>
        <Tooltip title="Collapse All" placement="left">
          <Button style={toolbarBtnStyle} type="primary" shape="circle" onClick={() => {chart.collapseAll(); chart.fit();}}><AiOutlineNodeCollapse /></Button>
        </Tooltip>
        <Tooltip title="Fit" placement="left">
          <Button style={toolbarBtnStyle} type="primary" shape="circle" onClick={() => chart.fit()}><MdOutlineFitScreen /></Button>
        </Tooltip>
        <Tooltip title="Layout" placement="left">
          <Dropdown
            overlay={menu}
            placement="topRight"
            arrow
            trigger={['click']}
          >
            <Button
              style={toolbarBtnStyle}
              type="primary" 
              shape="circle" 
            >
              <TbLayoutBoardSplit />
            </Button>
          </Dropdown>
        </Tooltip>
      </div>
      {cardShow && (
        <EmployeeDetailsCard
          employees={props.data}
          employee={props.data.find((employee) => employee.id === employeeId)}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default OrganizationalChart;
