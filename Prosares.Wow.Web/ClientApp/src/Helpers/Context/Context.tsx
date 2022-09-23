import jwt_decode from "jwt-decode";
import { createContext, useEffect } from "react";

export function getContext() {
  var token = getCookie("ApplicationToken");

  if (token === undefined) {
    // redirect to login if token is empty
    window.location.replace(window.location.origin);
    return null;
  }

  var decoded;

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
  return decoded;
}

// loader context
// @ts-ignore
export const LoaderContext = createContext<any>();
