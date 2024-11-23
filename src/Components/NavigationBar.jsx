import { NavLink } from "react-router-dom";
import { useAuthenticateContext } from "../Context_API/Authentication";
import { useState } from "react";

export default () => {

    const { successAuthentication, accountUrl } = useAuthenticateContext()

    const [isMobile, setIsMobile] = useState(false)

    const handleMenuClick = () => {
        setIsMobile(!isMobile)
    }

    return (
        <nav className="navbar">
            <div className="logo">
                <img src={`/logo.png`} alt="logo" />
            </div>
            <ul className={isMobile ? "nav-links-mobile" : "nav-links"}>
                <li><NavLink to="/" onClick={isMobile && handleMenuClick} >Home</NavLink></li>
                {
                    successAuthentication
                        ? <li><NavLink to={accountUrl} onClick={isMobile && handleMenuClick} >My Account</NavLink></li>
                        : <li><NavLink to={`/login/Institute`} onClick={isMobile && handleMenuClick} >Institute Login</NavLink></li>
                }
            </ul>
            <div className="hamburger" onClick={handleMenuClick}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    )
}