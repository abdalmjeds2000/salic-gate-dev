import React, { useContext } from "react";
import { Button, Typography } from "antd";
import { MdClose } from "react-icons/md";

const styles = {
  card: {
    position: "absolute",
    top: "85px",
    right: "0",
    width: "300px",
    height: "calc(100vh - 85px)",
    backgroundColor: "#fff",
    overflowY: "auto",
    borderRadius: '10px 0 0 10px',
    boxShadow: '-10px 0 30px #00000025'
  },
  cardCloseBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "30px",
    height: "30px",
    backgroundColor: "#fef9ef",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  // card::-webkit-scrollbar: {
  //   display: none;
  // },
  cardHeader: {
    textAlign: "center",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    // backgroundColor: 'var(--link-text-color)',
    backgroundColor: '#505050',
    padding: '15px',
  },
  cardImg: {
    width: "100px",
    borderRadius: "50%",
    border: '8px solid #fff'
  },
  cardName: {
    margin: "1rem 0 .5rem 0",
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: '#fff !important'
  },
  cardRole: {
    margin: "1rem 0",
    fontSize: "1rem",
    color: '#fff !important'
  },
  cardBody: {
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    padding: '20px'
  },
  cardItem: {
    width: "100%",
    fontSize: "1rem",
    paddingBottom: '5px',
    marginBottom: '10px',
    borderBottom: '3px solid #eaeaea'
  },
  cardItemLabel: {
    fontWeight: "bold",
    color: "#333 !important",
  },
  cardItemValue: {
    color: "#787878 !important",
  },
  cardItemImg: {
    width: "50px",
    height: "50px",
    margin: "0.2rem",
    borderRadius: "50%",
  },
  cardItemName: {
    marginLeft: "0.5rem",
    fontWeight: "bold",
  },
  cardItemRole: {
    fontSize: "0.8rem",
    marginLeft: "0.5rem",
  },
};
const { Text, Title } = Typography;

const EmployeeDetailsCard = (props) => {
  
  // const colors = [
  //   '#0c508c',
  //   '#3a9bcc',
  //   '#8540b8',
  //   '#e26565',
  //   '#75be68',
  //   '#e99b4d',
  //   '#6477aa',
  //   '#e05d2b',
  // ];
  // const color = colors[props.employee?.depth % colors.length];


  return (
    <div style={styles.card}>
      <Button 
        onClick={props.handleClose}
        style={styles.cardCloseBtn} 
        type="default" 
        shape="circle"
      >
        <MdClose />
      </Button>

      <div>
        <div style={{...styles.cardHeader, /* backgroundColor: color */}}>
          <img
            style={styles.cardImg}
            src={props.employee?.img}
            alt=""
          />
          <div>
            <Title level={2} style={styles.cardName} className="text-white">{props.employee?.name}</Title>
            <Text cstyle={styles.cardRole} className="text-white">{props.employee?.title}</Text>
          </div>
        </div>

        <div style={styles.cardBody}>
          {props.employee?.Mobile && (
            <>
              <div style={styles.cardItem}>
                <Text strong style={styles.cardItemLabel}>Phone:</Text><br />
                <Text style={styles.cardItemValue}>{props.employee?.Mobile}</Text>
              </div>
            </>
          )}
          {props.employee?.email && (
            <>
              <div style={styles.cardItem}>
                <Text strong style={styles.cardItemLabel}>Email:</Text><br />
                <Text style={styles.cardItemValue}>{props.employee?.email}</Text>
              </div>
            </>
          )}
          {props.employee?.Ext && (
            <>
              <div style={styles.cardItem}>
                <Text strong style={styles.cardItemLabel}>Ext:</Text><br />
                <Text style={styles.cardItemValue}>{props.employee?.Ext}</Text>
              </div>
            </>
          )}
          
          {props.employee?.department && (
            <>
              <div style={styles.cardItem}>
                <Text strong style={styles.cardItemLabel}>Department:</Text><br />
                <Text style={styles.cardItemValue}>{props.employee?.department}</Text>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsCard;
