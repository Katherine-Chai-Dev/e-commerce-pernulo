
import React from "react";
import {Layout,ConfigProvider} from 'antd';
import "./Footer.css"
const Footer = ()=>{
    return(
        <ConfigProvider
  theme={{
    token: {
        fontSize:25
      /* here is your global tokens */
    },
  }}
>
  
        <Layout.Footer className="footer">Your beauty, my passion, our pearls</Layout.Footer>
        </ConfigProvider>
    )
}
export default Footer