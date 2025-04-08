import React from "react";
import NavBar from "../features/navbar/NavBar";


interface ComponentWrapperProps {
  component: React.JSX.Element;
}

export const maxWidth : string = "1400px";

const style : React.CSSProperties = {
  maxWidth: maxWidth,
  marginLeft: "auto",
  marginRight: "auto",
  padding : "20px 10px 20px 10px"
}


const ComponentWrapper = ({ component } : ComponentWrapperProps) => {

  
  return <>
    <NavBar />
    <div style={style}>
      {component}
    </div>

  </>;
};

export default ComponentWrapper;