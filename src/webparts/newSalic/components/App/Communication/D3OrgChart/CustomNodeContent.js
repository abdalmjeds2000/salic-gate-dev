import React from "react";
import { FaBuilding } from "react-icons/fa";

const styles = {
  nodeContainer: {
    height: "150px",
    backgroundColor: "#227c9d",
    color: "#227c9d",
    display: "flex",
    justifyContent: "center",
    borderRadius: "1rem",
  },
  nodeDetails: {
    width: "100%",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  nodeContent: {
    display: "flex",
    alignItems: "center",
  },
  nodeImg: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    boxShadow: '0 10px 15px #00000024',
  },
  nodeInfo: {
    marginLeft: "1.5rem",
    color: "#fef9ef",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  nodeName: {
    paddingBottom: "0.3rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  nodeRole: {
    paddingBottom: "0.5rem",
    fontSize: "0.8rem",
  },
  nodeDepartment: {
    padding: "4px 8px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffcb77",
    borderRadius: "1rem",
    color: "#227c9d",
    fontSize: '0.6rem'
  },
  icon: {
    marginRight: "0.5rem",
  },
};

const CustomNodeContent = (props) => {
  return (
    <>
      <div style={{...styles.nodeContainer, backgroundColor: props.data.id == "1" ? '#1f3942' : '#227c9d'}}>
        <div style={styles.nodeDetails}>
            <div style={styles.nodeContent}>
              <img
                style={styles.nodeImg}
                src={props.data.imageUrl}
                alt=""
              />
              <div style={styles.nodeInfo}>
                <div style={styles.nodeName}>{props.data.name}</div>
                <div style={styles.nodeRole}>{props.data.positionName}</div>
                {props.data.department && (
                  <div style={styles.nodeDepartment}>
                    <FaBuilding style={styles.icon} />
                    <div>{props.data.department}</div>
                  </div>
                )}
              </div>
            </div>
          
        </div>
      </div>
    </>
  );
};

export default CustomNodeContent;
