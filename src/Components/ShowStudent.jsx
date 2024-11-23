import { useSelector } from "react-redux"
import { statusCode } from "../utils/statusFile.mjs"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock } from "@fortawesome/free-solid-svg-icons"

export default ({ student }) => {

    const { status: studentStatus } = useSelector(state => state.student)
    const navigate = useNavigate()

    const inputFields = [
        { type: "text", name: "firstName", defaultValue: student.studentName.firstName, label: "First Name", disable: true },
        { type: "text", name: "lastName", defaultValue: student.studentName.lastName, label: "Last Name", disable: true },
        { type: "email", name: "studentEmail", defaultValue: student.studentEmail, label: "Email", disable: true },
        { type: "text", name: "studentId", defaultValue: student.studentId, label: "Student ID", disable: true },
        { type: "text", name: "studentDOB", defaultValue: student.studentDOB, label: "DOB", disable: true },
    ]

    return (
        student
            ? <div className="account-container" >
                <div className="header">
                    <h2>Student&nbsp;Account</h2>
                </div>
                <form className="account-form">
                    {
                        inputFields.map(({ type, name, defaultValue, label, disable }) => (
                            <div key={name} className="form-group">
                                <label htmlFor={name}>{label}</label>
                                <input type={type} defaultValue={defaultValue} id={name} disabled />
                            </div>
                        ))
                    }
                    <div className="edit-buttons">
                        {
                            studentStatus == statusCode.IDLE &&
                            <button
                                onClick={() => navigate("/changePassword", { state: { userType: "student", userId: student._id, isOtpSent: false } })}
                                className="blue-btn"
                                type="button"
                            >
                                <FontAwesomeIcon icon={faLock} /> &nbsp;Change Password
                            </button>
                        }
                    </div>
                </form>
            </div>
            : <p>Something went wrong</p>
    )
}