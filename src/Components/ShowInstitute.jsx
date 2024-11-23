import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { modifyInstitute, removeInstiute } from "../Redux_Components/Features/instituteSlice.mjs";
import { removeAdmin } from "../Redux_Components/Features/adminSlice.mjs";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faSpinner, faLock, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";


export default () => {

    const { data: instiData } = useSelector(state => state.institute)
    const { isSuperAdmin } = useSelector(state => state.admin)

    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [canModify, setCanModify] = useState(false)
    const [instituteName, setInstituteName] = useState("")

    const modify = (e) => {
        setIsloading(true)
        axios.patch(`admin/modifyInstitute/${instiData._id}`, { instituteName })
            .then(res => {
                const { status, message } = res.data;
                setIsloading(false)
                toast(message)
                if (status) {
                    setCanModify(false)
                    dispatch(modifyInstitute(instituteName))
                    setInstituteName("")
                }
            })
            .catch(err => {
                setIsloading(false)
                console.error(`Modifing Institute --> ${err}`)
                toast("Network connection error")
            })
    }

    const formElems = [
        { type: "text", defaultValue: instiData.instituteId, disabled: true, label: "Institute Id", name: "id", onChange: null },
        { type: "text", defaultValue: instiData.instituteName, disabled: !canModify, label: "Institute Name", name: "name", onChange: (e) => setInstituteName(e.target.value) },
        { type: "email", defaultValue: instiData.superAdminMail, disabled: true, label: "Admin Mail", name: "mail", onChange: null },
        { type: "text", defaultValue: instiData.creationDateAndTime.date, disabled: true, label: "Creation Date", name: "date", onChange: null },
        { type: "text", defaultValue: instiData.creationDateAndTime.time, disabled: true, label: "Creation Time", name: "time", onChange: null },
    ]

    return (
        <>
            <div className="account-container">
                <div className="header">
                    <h2>Institute&nbsp;Account</h2>
                </div>
                <form className="account-form">
                    {
                        formElems.map(({ type, defaultValue, disabled, label, name, onChange }) => (
                            <div key={name} className="form-group" >
                                <label htmlFor={name}>{label}</label>
                                <input type={type} defaultValue={defaultValue} disabled={disabled} id={name} onChange={onChange} />
                            </div>
                        ))
                    }
                    <div className="edit-buttons">
                        {
                            canModify
                                ? <>
                                    <button type="button" className="save-btn" onClick={modify} disabled={isloading} >
                                        <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                        {isloading ? " Saving Changes..." : " Save Changes"}
                                    </button>
                                    <button type="button" onClick={() => { setCanModify(false); setName("") }} disabled={isloading} className="cancel-btn" >
                                        <FontAwesomeIcon icon={faBan} spin /> Cancel
                                    </button>
                                </>
                                : isSuperAdmin && <>
                                    <button type="button" onClick={() => {
                                        setCanModify(true); setInstituteName(instiData.instituteName)
                                    }} disabled={isRemoving || isloading} className="violet-btn" >
                                        <FontAwesomeIcon icon={faPenToSquare} /> &nbsp;Modify
                                    </button>
                                    <button type="button" className="blue-btn" disabled={isRemoving || isloading} onClick={() => navigate("/changePassword", { state: { userType: "institute", userId: instiData.instituteId, isOtpSent: false } })} >
                                        <FontAwesomeIcon icon={faLock} /> &nbsp;Change Password
                                    </button> {/* navigate to the change password page */}
                                </>
                        }
                    </div>
                </form>
            </div>

        </>
    )
}