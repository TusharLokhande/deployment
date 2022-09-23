import React from 'react'
import { Button, Container } from "react-bootstrap";
import "./AccessDenied.css";

function AccessDenied() {
  return (
    <Container>
    <div className="access-expired-body">
    <i className="fa fa-lock" style={{ fontSize: 200, color: "lightgrey" }}></i>
       
        <h2 className="expired-h2">
            <strong>Access Denied</strong>
        </h2>
        
    </div>
</Container>
  )
}

export default AccessDenied