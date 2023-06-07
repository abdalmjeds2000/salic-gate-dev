import React from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const styles = {
  expandBtn: {
    width: "20px",
    height: "20px",
    margin: "auto",
    color: "#227c9d",
    backgroundColor: "#fef9ef",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #d3d3d3",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: '0.6rem'
  },
  flex: {
    display: "flex",
  },
};

const CustomExpandButton = (node) => {
  
  return (
    <>
      {node && (
        <div style={{...styles.expandBtn}}>
          <span>{node.data._directSubordinates}</span>
          <span style={styles.flex}>
            {node.children ? <FaAngleUp /> : <FaAngleDown />}
          </span>
        </div>
      )}
    </>
  );
};

export default CustomExpandButton;
