import React from "react";
import { Redirect } from "react-router-dom";
import cookie from "js-cookie";

function ProtectedHome() {
  console.log(cookie.get("akun"));
  if (cookie.get("akun") === undefined) {
    return <Redirect push to="/" />;
  } else {
    return <Redirect exact push to="/" />;
  }
}

export default ProtectedHome;
