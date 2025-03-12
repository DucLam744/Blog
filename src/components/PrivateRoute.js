import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({isAuthencated, children}) => {
    if (!isAuthencated) {
        return <Navigate to={'/'}/>;
    }
    return children;
}

export default PrivateRoute;