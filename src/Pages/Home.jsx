import { Outlet } from "react-router-dom"
import NavigationBar from "../Components/NavigationBar"
import Footer from "../Components/Footer"

export default () => {
    return (
        <>
            <NavigationBar />
            <Outlet />
            <Footer/>
        </>
    )
}