import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { modifyAdmin } from "../Redux_Components/Features/adminSlice.mjs";
import { toast } from "react-toastify";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faSpinner, faLock, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default () => {
    const { data: admin, isSuperAdmin } = useSelector(state => state.admin);
    const [adminData, setAdminData] = useState(admin)
    const [canModify, setCanModify] = useState(false)

    const navigate = useNavigate()

    const { isloading, setIsloading } = useLoadingContext()

    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData({
            ...adminData,
            [name]: value
        })
    }

    const updateAdmin = (e) => {
        e.preventDefault()
        setIsloading(true)
        axios.put(`admin/modifyAdminAccount/${admin._id}`, adminData)
            .then(res => {
                const { status, message } = res.data;
                setCanModify(false)
                toast(message)

                setIsloading(false)
                if (status) dispatch(modifyAdmin(adminData))
            })
            .catch(err => {
                setIsloading(false)
                console.error(`Modifing Department Admin --> ${err}`)
                toast("Network connection error")
            })
    }

    const formElems = [
        { type: "text", placeholder: "Enter first name", name: "adminFirstName", defaultValue: admin?.adminFirstName, onChange: handleChange, label: "First Name", disabled: !canModify },
        { type: "text", placeholder: "Enter last name", name: "adminlastName", defaultValue: admin?.adminLastName, onChange: handleChange, label: "Last Name", disabled: !canModify },
        { type: "email", placeholder: "Enter admin Email", name: "adminEmail", defaultValue: admin?.adminEmail, onChange: handleChange, label: "Email", disabled: true },
        { type: "text", placeholder: "Enter designation", name: "designation", defaultValue: admin?.designation, onChange: handleChange, label: "Designation", disabled: !canModify },
        { type: "text", placeholder: "Enter mobile number", name: "mobileNumber", defaultValue: admin?.mobileNumber, onChange: handleChange, label: "Ph. No", disabled: !canModify },
    ]

    return (
        admin
            ? <div className="account-container" >
                <div className="header">
                    <h2>Admin&nbsp;Account</h2>
                </div>
                <form onSubmit={updateAdmin} className="account-form" >
                    {
                        formElems.map(({ type, name, label, defaultValue, onChange, disabled }) => (
                            <div key={name} className="form-group">
                                <label htmlFor={name}>{label}</label>
                                {
                                    canModify
                                        ? <input type={type} id={name} defaultValue={defaultValue} name={name} onChange={onChange} disabled={disabled} />
                                        : <input type={type} id={name} value={defaultValue} name={name} disabled />
                                }

                            </div>
                        ))
                    }
                    <div className="edit-buttons" >
                        {
                            isSuperAdmin ?
                                canModify
                                    ? <>
                                        <button disabled={isloading} className="save-btn" >
                                            <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                            {isloading ? " Saving Changes..." : " Save Changes"}
                                        </button>
                                        <button type="button" className="cancel-btn" onClick={() => {
                                            setCanModify(false);
                                            setAdminData(admin)
                                        }} disabled={isloading} >
                                            <FontAwesomeIcon icon={faBan} spin /> Cancel
                                        </button>
                                    </>
                                    : <button type="button" className="violet-btn" onClick={() => setCanModify(true)}>
                                        <FontAwesomeIcon icon={faPenToSquare} /> &nbsp;Modify
                                    </button>
                                : ""
                        }
                        {!canModify && <button type="button" className="blue-btn" onClick={() => navigate("/changePassword", { state: { userType: "admin", userId: admin._id, isOtpSent: false } })} >
                            <FontAwesomeIcon icon={faLock} /> &nbsp;Change Password
                        </button>}
                    </div>
                </form>
            </div>
            : <p>
                Something went wrong
            </p>
    )
}