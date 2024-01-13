import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getUser } from "../server/api";
import { useAuth } from "./AuthContextProvider";

const ProfileContext = createContext();

const ProfileContextProvider = ({ children }) => {
    // State to hold the authentication token
    const { token } = useAuth();
    const user_data = useQuery("profile", getUser, {
        enabled: !token,
    });

    useEffect(() => {
        if (token) {
            user_data.refetch()
        }

    }, [token])


    useEffect(() => {

        if (user_data.error?.response?.status === 401) {
            LOGOUT()
            window.location.href = "/"
        }
    }, [user_data.data]);

    const profiledata = useMemo(() => {
        return user_data.data?.data
    }, [user_data.data])


    // Memoized value of the authentication context
    const contextValue = useMemo(
        () => ({

            user_data,
            profiledata
        }),
        [user_data, profiledata]
    );


    // Provide the authentication context to the children components
    return (
        <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>
    );
};

export const useProfile = () => {
    return useContext(ProfileContext);
};


export default ProfileContextProvider;
