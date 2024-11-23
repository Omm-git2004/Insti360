import { createContext, useContext, useState } from "react";

const ConfidentialContext = createContext()

export const useConfidentialContext = () => useContext(ConfidentialContext)

export const ConfidentialProvider = ({ children, password }) => {
    const [confidentialPassword, setConfidentialPassword] = useState("")

    return (
        <ConfidentialContext.Provider value={{ confidentialPassword, setConfidentialPassword }} >
            {children}
        </ConfidentialContext.Provider>
    )
}