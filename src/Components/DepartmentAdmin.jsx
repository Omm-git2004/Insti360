import { toast } from "react-toastify"
import axios from "axios"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAdmin_dept, removeAdmin_dept } from "../Redux_Components/Features/departmentSlice.mjs";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { useConfidentialContext } from "../Context_API/Confidential";
import FormPopUp from "./Others/FormPopUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faPenToSquare, faSpinner, faTrashCan, faUserLock } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "./Others/PopWindow";

export default ({ deptId }) => {
    const { data: deptData } = useSelector(state => state.department);
    const { data: instiData } = useSelector(state => state.institute)

    const { confidentialPassword } = useConfidentialContext()

    const [adminInfo, setAdminInfo] = useState(null)
    const [adminData, setAdminData] = useState(null)
    const [toggle, setToggle] = useState(false)

    const [canRemoveAdmin, setCanRemoveAdmin] = useState(false)

    const dispatch = useDispatch()

    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext()

    const queryParams = {
        instituteId: instiData?.instituteId,
        instituteName: instiData?.instituteName,
        institutePass: confidentialPassword,
        departmentId: deptData?._id,
        departmentName: deptData?.departmentName,
        headOfDepartment: deptData?.headOfDepartment,
    };

    // Serialize the object into a query string
    const queryString = new URLSearchParams(queryParams).toString();

    useEffect(() => {
        // Find the admin information using his/her email
        if (deptData.adminMail !== "") {
            axios.get(`admin/getAdminByMail/?adminEmail=${deptData.adminMail}`)
                .then(res => {
                    const { status, message } = res.data;
                    if (!status) return toast(message)
                    setAdminInfo(message)
                    setAdminData(message)
                })
        }
    }, [deptData])



    const addAdmin = (e) => {
        e.preventDefault();
        setIsloading(true)
        axios.post(`admin/createDeptAdmin/${deptData._id}/?${queryString}`, adminData)
            .then(res => {
                setIsloading(false)
                const { status, message } = res.data;
                if (!status) return toast(message)
                setToggle(false)
                setAdminInfo(message)
                setAdminData(message)
                dispatch(addAdmin_dept(adminData.adminEmail))
            })
            .catch(err => {
                setIsloading(false)
                console.error(`Creating Department Admin --> ${err}`)
                toast("Network connection error")
            })
    }

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

        axios.put(`admin/modifyAdminAccount/${adminInfo._id}`, adminData)
            .then(res => {
                setIsloading(false)
                const { status, message } = res.data;
                toast(message)
                if (status) {
                    setToggle(false)
                    setAdminInfo(adminData)
                }
            })
            .catch(err => {
                setIsloading(false)
                console.error(`Modifing Department Admin --> ${err}`)
                toast("Network connection error")
            })
    }

    const removeAdmin = () => {
        setIsRemoving(true)
        axios.delete(`admin/removeAdminAccount/?departmentId=${deptId}&adminId=${adminInfo._id}`)
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    setAdminData(null)
                    setAdminInfo(null)
                    dispatch(removeAdmin_dept())
                }
                toast(message)
            })
            .catch(err => {
                console.error(`Removing Department Admin --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => {
                setCanRemoveAdmin(false)
                setIsRemoving(false)
            })
    }

    const formElems = [
        { type: "text", placeholder: "Enter first name", name: "adminFirstName", defaultValue: adminInfo?.adminFirstName, onChange: (e) => handleChange(e), label: "First Name" },
        { type: "text", placeholder: "Enter last name", name: "adminLastName", defaultValue: adminInfo?.adminLastName, onChange: (e) => handleChange(e), label: "Last Name" },
        { type: "email", placeholder: "Enter admin Email", name: "adminEmail", defaultValue: adminInfo?.adminEmail, onChange: (e) => handleChange(e), label: "Email", disabled: !toggle },
        { type: "text", placeholder: "Enter designation", name: "designation", defaultValue: adminInfo?.designation, onChange: (e) => handleChange(e), label: "Designation" },
        { type: "text", placeholder: "Enter mobile number", name: "mobileNumber", defaultValue: adminInfo?.mobileNumber, onChange: (e) => handleChange(e), label: "Ph. No" },
    ]

    const handleCancel = () => {
        setToggle(false);
        setAdminData(null)
    }

    return (
        <div className="account-container">
            {canRemoveAdmin && <PopWindow userType={"Department Admin"} onClose={() => setCanRemoveAdmin(false)} onProceed={removeAdmin} />}
            <div className="header">
                <h2>Department&nbsp;Admin</h2>
            </div>
            {
                adminInfo
                    ? <form onSubmit={(e) => e.preventDefault()} className="account-form">
                        {
                            formElems.map(({ type, name, label, defaultValue, onChange }) => (
                                <div key={name} className="form-group">
                                    <label htmlFor={name}>{label}</label>
                                    {
                                        toggle
                                            ? <input type={type} id={name} defaultValue={defaultValue} name={name} onChange={onChange} disabled={name === "adminEmail" ? true : !toggle} />
                                            : <input type={type} id={name} value={defaultValue} name={name} disabled />
                                    }
                                </div>
                            ))
                        }
                        {/* if toggle is true then show the cancel and save changes buttons else show the change button */}
                        <div className="edit-buttons">
                            {
                                toggle
                                    ? <>
                                        <button
                                            type="submit"
                                            disabled={isloading || isRemoving}
                                            className="save-btn"
                                            onClick={updateAdmin}
                                        >
                                            <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                            {isloading ? " Saving Changes..." : " Save Changes"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setToggle(false);
                                                setAdminData(adminInfo)
                                            }}
                                            type="button"
                                            disabled={isloading || isRemoving}
                                            className="cancel-btn"
                                        >
                                            <FontAwesomeIcon icon={faBan} spin /> Cancel
                                        </button>
                                    </>
                                    : <>
                                        <button type="button" className="violet-btn" onClick={() => setToggle(true)} disabled={isloading || isRemoving}>
                                            <FontAwesomeIcon icon={faPenToSquare} /> &nbsp;Modify
                                        </button>
                                        <button type="button" onClick={() => setCanRemoveAdmin(true)} disabled={isloading || isRemoving} className="remove-btn">
                                            <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} />
                                            {isRemoving ? " Removing Admin..." : " Remove Admin"}
                                        </button>
                                    </>
                            }
                        </div>
                    </form >
                    : <div>   {/* if toggle is true then show cancel button else show the add admin button*/}
                        {
                            toggle
                                ? <FormPopUp onSubmit={addAdmin} onClose={handleCancel} formElems={formElems} />
                                : <div
                                    className="btn-container"
                                    style={{ display: "flex", width: "100%", height: "80vh", justifyContent: "center", alignItems: "center" }}
                                >
                                    <button
                                        onClick={() => setToggle(true)}
                                        className="add-btn"
                                        style={{
                                            width: "180px", height: "50px",
                                            fontSize: "12pt"
                                        }} >
                                        <FontAwesomeIcon icon={faUserLock} /> &nbsp;Add Admin
                                    </button>
                                </div>
                        }
                    </div >
            }
        </div>


    )
}