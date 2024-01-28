import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getUser } from "../server/api";
import { useAuth } from "./AuthContextProvider";

const UserTypeContext = createContext();

const UserTypeContextProvider = ({ children }) => {
    
    const [usertype, setUsertype] = useState(localStorage.getItem('usertype') || 'Admin');

    const [isAdmin , setIsAdmin] = useState(false);

    useEffect(() => {
        let userType = localStorage.getItem('usertype');
        console.log(userType, "User type")
        if(userType == 'null' || userType == null || userType == 'Admin'){
            setIsAdmin(true);
            localStorage.setItem('usertype', 'Admin', isAdmin);
        }else{
            setIsAdmin(false);
        }
    }, []);

    const ChangeUserType = (newUserType) => {
        localStorage.setItem('usertype', newUserType)
        setUsertype(newUserType)
    };

    // Memoized value of the authentication context
    const contextValue = useMemo(
        () => ({
            usertype,
            isAdmin,
            ChangeUserType,
        }),
        [usertype, isAdmin, ChangeUserType]
    );


    // Provide the authentication context to the children components
    return (
        <UserTypeContext.Provider value={contextValue}>{children}</UserTypeContext.Provider>
    );
};

export const useUserType = () => {
    return useContext(UserTypeContext);
};


export default UserTypeContextProvider;
