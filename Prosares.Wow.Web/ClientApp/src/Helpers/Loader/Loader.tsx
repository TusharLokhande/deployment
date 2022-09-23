import React from "react";
import { Spinner } from "react-bootstrap";
import "./Loader.css";

const Loader = () => {
  return (
    <>
      <div className="spinner">
        <Spinner animation="border" variant="secondary" />
      </div>
    </>
  );
};

export default Loader;
