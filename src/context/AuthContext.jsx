import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();


export default function AuthProvider({ children }) {


    const savedUser = localStorage.getItem("user");


    const [user, setUser] = useState(
        savedUser ? JSON.parse(savedUser) : null
    );



    const login = (userData, token) => {

        localStorage.setItem("token", token);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);

    };



    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

    };



    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}





export function useAuth() {

    return useContext(AuthContext);

}