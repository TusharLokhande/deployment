import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Protected = ({ permittedPages, children }) => {
  const [env, setEnv] = useState<any>(
    process.env.REACT_APP_PUBLISH_PATH ? process.env.REACT_APP_PUBLISH_PATH : ""
  );
  //  const [context, setContext] = useState<any>({});
  var decoded;

  var token = getCookie("ApplicationToken");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return parts
        .pop()
        .split(";")
        .shift();
  }

  if (token != undefined) {
    decoded = jwt_decode(token);
  }

  var results = false;
  if (decoded != undefined) {
    results = decoded.Permissions.includes(permittedPages);
  }

  if (!results) {
    return <Navigate to={`${env}/AccessDenied`} replace />;
  }
  return children;
};
export default Protected;
