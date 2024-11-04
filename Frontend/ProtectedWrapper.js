import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const ProtectedWrapper = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);

    if (!user.isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/no-access" />;
    }

    return children;
};

export default ProtectedWrapper;
