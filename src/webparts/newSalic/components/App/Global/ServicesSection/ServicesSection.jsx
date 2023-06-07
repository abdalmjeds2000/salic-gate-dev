import React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServicesSection.css';
import { AppCtx } from "../../App";
import { Typography } from 'antd';
import { MdOpenInNew } from 'react-icons/md';
// import { motion } from "framer-motion";

const ServicesSection = ({ title, items, headerIcon }) => {
  const { defualt_route } = useContext(AppCtx)
  const navigate = useNavigate();


  return (
    <div className='services-page-container'>
      <div className="header">
        {headerIcon}
        <h2>{title}</h2>
      </div>

      <div className='services-body-container'>
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0, 0.5, 0.2, 1]
          }}
        > */}
          <div className="services-boxs-container">
            {items.map((service, i) => {
              return ( 
                // <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }}>
                  <a
                    key={i}
                    className="box"
                    onClick={() => {
                      service.isLink
                      ? window.open(service.to, "_blank")
                      : navigate(defualt_route + service.to)
                    }}
                  >
                    <div className='img-container' style={{ backgroundColor: service.bgColor }}>
                      {service.icon}
                    </div>
                    <div>
                      <h3>{service.text} {service.isLink ? <span className='open-in-new'><MdOpenInNew /></span> : ''}</h3>
                      { service.description ? <Typography.Text type='secondary'>{service.description}</Typography.Text> : null }
                    </div>
                  </a>
                // </motion.div>
              )
            })}
          </div>
        {/* </motion.div> */}
      </div>
    </div>
  )
}

export default ServicesSection