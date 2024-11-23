import { createContext, useContext, useState } from "react";

const LoadingContext = createContext()

export const useLoadingContext = () => useContext(LoadingContext)

export const LoadingProvider = ({ children }) => {
    const [isloading, setIsloading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true) // the initital value will always be true. If the user cookie is available then the data will be retrieved and isAuthenticating value will be set to false and if not found then also it will be set to false

    return (
        <LoadingContext.Provider value={{
            isloading, setIsloading,
            isUploading, setIsUploading,
            isDownloading, setIsDownloading,
            isRemoving, setIsRemoving,
            isAuthenticating, setIsAuthenticating
        }} >
            {children}
        </LoadingContext.Provider>
    )
}