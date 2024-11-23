import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useLoadingContext } from "../../Context_API/LoadingContext"
import { faBan, faRemove, faSpinner, faWarning } from "@fortawesome/free-solid-svg-icons"
import { useRef, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

export default ({ children, onClose, onProceed, userType }) => {
    const { isloading, isRemoving, setIsRemoving } = useLoadingContext()
    const { data: admin } = useSelector(state => state.admin)

    const [password, setPassword] = useState("")

    const passRef = useRef()

    const checkAdminPassword = () => {
        if (password.trim() === "") {
            passRef.current.focus = true;
            return toast("Please enter admin password")
        }

        const encodedPass = encodeURIComponent(password.trim())
        setIsRemoving(true)

        axios.get(`admin/checkPassword/?adminEmail=${admin.adminEmail}&adminPassword=${encodedPass}`)
            .then(res => {
                if (res.data === true) onProceed()
                else toast("Wrong Admin Password")
            })
            .catch(err => {
                console.error(`Checking admin password --> ${err}`)
                if (err.response.status === 404) return toast(err.response.data)
                toast("Network connection error")
            })
            .finally(() => setIsRemoving(false))
    }

    return (
        <div className="popup-wrapper">
            <div className="popup-overlay" onClick={() => !isloading && onClose()}></div>
            <div className="popup-content">
                <div className="content">
                    <div className="top-div">
                        {
                            userType === "Exam" || userType === "Assignment" || userType === "Paper" || userType === "Announcement" || userType === "submitExam"
                                ? <>
                                    <h3>{userType === "submitExam" ? "Confirm To Proceed ?" : "Are You Sure ?"}</h3>
                                </>
                                : <>
                                    <h3>{userType} {userType !== "Batch Update" && "Account Deletion"}</h3>
                                    <p><span style={{ color: "red" }}> <FontAwesomeIcon icon={faWarning} /> Warning </span> :
                                        {
                                            userType === "Batch Update"
                                                ? "Batch Semester will be updated and all the exams, assignments and announcements related to the batch will be deleted."
                                                : `All details related to the ${userType} will be deleted.`
                                        }
                                    </p>
                                    <input type="password" placeholder="Enter Admin Password" onChange={(e) => setPassword(e.target.value)} ref={passRef} />
                                </>
                        }
                    </div>


                    <div className="btn-container">
                        <button onClick={() => { userType === "Exam" || userType === "Assignment" || userType === "Paper" || userType === "Announcement" || userType === "submitExam" ? onProceed() : checkAdminPassword() }} className="violet-btn" >
                            <FontAwesomeIcon icon={isRemoving || isloading ? faSpinner : faWarning} spin={isRemoving || isloading} />
                            {isRemoving ? " Proceeding" : " Proceed"}
                        </button>
                        <button onClick={onClose} className="cancel-btn">
                            <FontAwesomeIcon icon={faBan} /> Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}