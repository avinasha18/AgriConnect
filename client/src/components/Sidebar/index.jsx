// Sidebar.jsx
import React, { useState } from "react";
// import Logo from "../imgs/logo.png";
import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
import { SidebarData } from "../../Data";
import { motion } from "framer-motion";
import './index.css'
import { Link } from "react-router-dom";
const Sidebar = () => {
  const [selected, setSelected] = useState(0);

  const [expanded, setExpaned] = useState(true)

  const sidebarVariants = {
    true: {
      left: '0'
    },
    false: {
      left: '-60%'
    }
  }
  console.log(window.innerWidth)
  return (
    <>
      <div className="bars" style={expanded ? { left: '60%' } : { left: '5%' }} onClick={() => setExpaned(!expanded)}>
        <UilBars />
      </div>
      <motion.div className='sidebar'
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ''}
      >
        <div className="logo">

          <span>
            Agri<span> Co</span>nnect
          </span>
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => {
            return (


              <div
                className={selected === index ? "menuItem active" : "menuItem"}
                key={index}
                onClick={() => setSelected(index)}
              >

                <item.icon />
                <Link to={item.to}> <span>{item.heading}</span></Link>

              </div>

            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;