import { faBan, faClock, faPaperPlane, faRefresh, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useLoadingContext } from "../Context_API/LoadingContext"

export default () => {

    const navigate = useNavigate()
    const userType = useParams().userType;

    const { isloading, setIsloading } = useLoadingContext()

    const { data: instiData } = useSelector(state => state.institute)

    const [mail, setMail] = useState("")
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [otp, setOtp] = useState("") // this state will store the otp entered by the user
    const [actualOtp, setActualOtp] = useState("") // this state will store the actual otp sent by the server
    const [timer, setTimer] = useState(9);

    const intervalRef = useRef(null)

    const timerFunction = () => {
        intervalRef.current = setInterval(() => {
            timer > 0 ? setTimer(prev => prev - 1) : clearInterval(intervalRef.current);
        }, 1000)
    }

    const sendOtp = () => {
        setIsloading(true)
        setTimer(9)
        axios.post("sendOtp", { mail, instituteName: instiData.instituteName, userType })
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    toast("OTP sent successfully")
                    setActualOtp(message)
                    setIsOtpSent(true)
                    timerFunction()
                }
                else toast(message)
            })
            .catch(err => {
                console.error(`Sending Otp --> ${err}`)
                if (err.response.status == 400) return toast(err.response.data)
                toast("Network connection error")
            })
            .finally(() => setIsloading(false))
    }

    const proceed = () => {
        if (actualOtp !== otp) return toast("OTP doesn't match")
        else return navigate("/changePassword", { state: { userType: `${userType}_mail`, userId: mail, isOtpSent } })
    }

    return (
        <>
            {
                !isOtpSent
                    ? <div className="edit-password-wrapper">
                        <div className="edit-password-container">
                            <input
                                type="email"
                                onChange={(e) => setMail(e.target.value)}
                                key="email"
                                className="edit-password-input"
                                placeholder="Enter Your Registered Mail"
                            />

                            <div className="edit-password-buttons">
                                <button onClick={sendOtp} disabled={isloading} className="edit-password-button save" >
                                    <FontAwesomeIcon icon={isloading ? faSpinner : faPaperPlane} spin={isloading} /> {isloading ? " Sending..." : "Send OTP"}
                                </button>
                                <button onClick={() => navigate(-1)} className="edit-password-button cancel">
                                    <FontAwesomeIcon icon={faBan} style={{ marginLeft: "5px" }} spin /> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                    : <div className="edit-password-wrapper">
                        <div className="edit-password-container">

                            <input
                                type="text"
                                onChange={(e) => setOtp(e.target.value)}
                                key="otp"
                                className="edit-password-input"
                                placeholder="Enter the OTP"
                            />

                            <div className="edit-password-buttons">
                                <button onClick={proceed} className="edit-password-button save">Proceed</button>
                                <button onClick={sendOtp} disabled={timer > 0} className="edit-password-button violet-btn">
                                    <FontAwesomeIcon icon={timer > 0 ? faClock : faRefresh} spin={timer <= 0} /> {timer > 0 ? `Resend after ${timer}s` : "Resend"}
                                </button>
                                <button onClick={() => navigate(-1)} className="edit-password-button cancel">
                                    <FontAwesomeIcon icon={faBan} style={{ marginLeft: "5px" }} spin /> Cancel
                                </button>
                            </div>
                        </div>

                    </div>
            }
        </>
    )
}