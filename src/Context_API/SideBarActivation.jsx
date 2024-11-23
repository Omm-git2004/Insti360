import { createContext, useContext, useState } from "react";

const SideBarActiveContext = createContext()
export const useSideBarActiveContext = () => useContext(SideBarActiveContext)

export const SideBarProvider = ({ children }) => {

    const [activeSideBar, setActiveSideBar] = useState(false)

    return (
        <SideBarActiveContext.Provider value={{ activeSideBar, setActiveSideBar }} >
            {children}
        </SideBarActiveContext.Provider>
    )
}