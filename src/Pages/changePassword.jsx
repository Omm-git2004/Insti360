import axios from "axios"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useLoadingContext } from "../Context_API/LoadingContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faRotate, faSpinner } from "@fortawesome/free-solid-svg-icons";

const ChangePasswordPage = () => {

    const navigate = useNavigate()
    const loc = useLocation()
    const { isloading, setIsloading } = useLoadingContext()

    const userType = loc?.state.userType;
    const userId = loc?.state.userId;
    const isOtpSent = loc?.state.isOtpSent; // true means the otp has been sent and no need to enter the old password else the old password must be entered before creating a new password

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [againPassword, setAgainPassword] = useState("")

    const savePassword = () => {
        if (!isOtpSent && oldPassword.trim() === "") return toast("Please enter old password")
        else if (newPassword.trim() === "") return toast("Please enter new password")
        else if (newPassword !== againPassword) return toast("New Password and confirmation password must be same")
        else {
            setIsloading(true)
            axios.patch(`changePassword/?userType=${userType}&userId=${userId}`, { oldPassword, newPassword })
                .then(res => {
                    const { status, message } = res.data;
                    toast(message)
                    if (status) return navigate(-1)
                })
                .catch(err => {
                    console.error(`Changing password --> ${err}`)
                    if (err.response.status === 400) return toast(err.response.data)
                    toast("Network connection error")
                })
                .finally(() => setIsloading(false))
        }
    }

    return (
        <div className="edit-password-wrapper">
            <div className="edit-password-container">
                {
                    !isOtpSent && <input
                        type="password"
                        className="edit-password-input"
                        placeholder="Enter Old Password"
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                }
                <input
                    type="password"
                    className="edit-password-input"
                    placeholder="Enter New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    className="edit-password-input"
                    placeholder="Confirm Password"
                    onChange={(e) => setAgainPassword(e.target.value)}
                />
                <div className="edit-password-buttons">
                    <button
                        className="edit-password-button save"
                        onClick={savePassword}
                        disabled={isloading}
                    >
                        <FontAwesomeIcon icon={isloading ? faSpinner : faRotate} spin />
                        {isloading ? " Saving Password..." : " Save Password"}
                    </button>
                    <button
                        className="edit-password-button cancel"
                        onClick={() => navigate(-1)}
                        disabled={isloading}
                    >
                        <FontAwesomeIcon icon={faBan} style={{ marginLeft: "5px" }} spin /> Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordPage;