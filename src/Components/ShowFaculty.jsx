import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { modifyFaculty_dept, removeFaculty_dept } from "../Redux_Components/Features/departmentSlice.mjs"
import { useLoadingContext } from "../Context_API/LoadingContext"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBan, faCheck, faClose, faLock, faPenToSquare, faPlus, faSpinner, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import PopWindow from "./Others/PopWindow"

export default ({ deptId, faculty_id, faculty, goBack }) => { // if faculty is null means this component is accessed by the admin else by faculty

    const [facultyInfo, setFacultyInfo] = useState(faculty)

    const { data: deptData } = useSelector(state => state.department)
    const { data: instituteInfo } = useSelector(state => state.institute)
    const { data: admin } = useSelector(state => state.admin)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext()

    const [facultyData, setFacultyData] = useState(facultyInfo)

    const [canUpdate, setCanUpdate] = useState(false)

    const [canDelete, setCanDelete] = useState(false)

    useEffect(() => {
        if (faculty_id) {

            axios.get(`admin/getFaculty/${faculty_id}`)
                .then(res => {
                    const { status, message } = res.data;
                    if (!status) return toast(message)

                    setFacultyInfo(message)
                    setFacultyData(message)
                })
                .catch(err => {
                    console.error(`Retrieving faculty info --> ${err}`)
                    toast("Network connection error")
                })
        }
    }, [faculty_id])

    const deleteFaculty = () => {

        setIsRemoving(true)

        axios.delete(`admin/handleFacultyAccount/?departmentId=${deptId}&facultyId=${faculty_id}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message)
                if (status) {
                    dispatch(removeFaculty_dept(faculty_id))
                    goBack()
                }
            })
            .catch(err => {
                console.error(`Deleting faculty --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => setIsRemoving(false))
    }

    const modifyFaculty = (e) => {
        e.preventDefault()

        setIsloading(true)

        axios.patch(`admin/handleFacultyAccount/?instituteId=${instituteInfo.instituteId}&departmentId=${deptId}`, facultyData)
            .then(res => {
                setIsloading(false)
                const { status, message } = res.data;
                if (!status) {
                    setFacultyData(facultyInfo)
                    return toast(message)
                }
                setCanUpdate(false)
                setFacultyInfo(message)
                setFacultyData(message)
                dispatch(modifyFaculty_dept({ facultyId: faculty_id, facultyDeptId: facultyData.facultyId }))
            })
            .catch(err => {
                setIsloading(false)
                console.error(`Modifing faculty --> ${err}`)
                toast("Network connection error")
            })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFacultyData({
            ...facultyData,
            [name]: value
        })
    }

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        setFacultyInfo({
            ...facultyInfo,
            facultyName: {
                ...facultyInfo.facultyName,
                [name]: value
            }
        })
    }

    const removeSubject = (index) => {
        let tempSub = [...facultyData.subjects];
        tempSub.splice(index, 1);
        setFacultyData({
            ...facultyData,
            subjects: tempSub
        })
    }

    const addSubject = () => {
        setFacultyData({
            ...facultyData,
            subjects: [...facultyData.subjects, ""]
        })
    }

    const handleSubjects = (val, index) => {
        let temp = [...facultyData.subjects];
        temp[index] = val;
        setFacultyData({
            ...facultyData,
            subjects: temp
        })
    }

    const formElems = [
        { type: "type", name: "facultyId", onchange: handleChange, defaultValue: facultyInfo?.facultyId, label: "Faculty Id" },
        { type: "text", name: "firstName", onchange: handleNameChange, defaultValue: facultyInfo?.facultyName.firstName, label: "First Name" },
        { type: "text", name: "lastName", onchange: handleNameChange, defaultValue: facultyInfo?.facultyName.lastName, label: "Last Name" },
        { type: "email", name: "facultyEmail", onchange: handleChange, defaultValue: facultyInfo?.facultyEmail, label: "Faculty Email" },
        { type: "type", name: "designation", onchange: handleChange, defaultValue: facultyInfo?.designation, label: "Designation" },
    ]

    return (
        facultyInfo
            ? <div className="account-container" >
                {canDelete && <PopWindow userType={"Faculty"} onClose={() => setCanDelete(false)} onProceed={deleteFaculty} />}
                <div className="header">
                    <h2>Faculty Account</h2>
                </div>
                <form onSubmit={modifyFaculty} className="account-form" >
                    <div className="back-btn">
                        {!faculty && <button onClick={goBack} className="cancel-btn" >
                            <FontAwesomeIcon icon={faClose} />
                        </button>}
                    </div>
                    {
                        formElems.map(({ type, name, defaultValue, onchange, label }) => (
                            <div key={name} className="form-group">
                                <label htmlFor={name}>{label}</label>
                                {
                                    canUpdate
                                        ? <input type={type} name={name} id={name} key={name} defaultValue={defaultValue} onChange={onchange} />
                                        : <input type={type} name={name} id={name} key={name} value={defaultValue} disabled />
                                }

                            </div>
                        ))
                    }
                    {
                        <div className="select-container">
                            {
                                facultyData?.subjects.length > 0 && facultyData.subjects.map((sub, index) => (
                                    <div key={sub} className="select-item">
                                        <select name="subjects" value={sub} disabled={!canUpdate} onChange={(e) => handleSubjects(e.target.value, index)} >
                                            <option value="" disabled >choose subject</option>
                                            {
                                                deptData.papers.map(({ name, semester }) => (
                                                    <option key={`${name + index}`} value={name}>{name.toUpperCase()}</option>
                                                ))
                                            }
                                        </select>
                                        {canUpdate && <button type="button" className="remove-btn" onClick={() => removeSubject(index)} disabled={isloading || isRemoving} >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </button>}
                                    </div>
                                ))
                            }
                            {canUpdate && <button type="button" onClick={addSubject} disabled={isloading || isRemoving} className="add-btn">
                                <FontAwesomeIcon icon={faPlus} /> Add Subject
                            </button>}
                        </div>
                    }
                    <div className="edit-buttons">
                        {
                            !faculty
                                ? canUpdate
                                    ? <div>
                                        <button type="button" onClick={modifyFaculty} disabled={isloading || isRemoving} className="save-btn">
                                            <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} /> {isloading ? "Saving Changes..." : "Save Changes"}
                                        </button>
                                        <button type="button" onClick={() => { setFacultyData(facultyInfo); setCanUpdate(false) }} disabled={isloading || isRemoving} className="cancel-btn">
                                            <FontAwesomeIcon icon={faBan} spin /> Cancel
                                        </button>
                                    </div>
                                    : admin && <button type="button" onClick={() => setCanUpdate(true)} disabled={isloading || isRemoving} className="violet-btn" >
                                        <FontAwesomeIcon icon={faPenToSquare} /> Modify
                                    </button>
                                : ""
                        }
                        {
                            faculty
                                ? <button disabled={isloading || isRemoving} onClick={() => navigate("/changePassword", { state: { userType: "faculty", userId: faculty._id, isOtpSent: false } })} className="blue-btn" >
                                    <FontAwesomeIcon icon={faLock} /> Change Password</button> // navigate to the change password route
                                : (admin && !canUpdate && <button onClick={() => setCanDelete(true)} disabled={isloading || isRemoving} className="remove-btn" >
                                    <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} /> {isRemoving ? " Removing..." : " Remove Faculty"}
                                </button>)
                        }
                    </div>
                </form>

            </div >
            : <div>
                <button onClick={goBack} >Back</button>
                Loading Faculty Info...
            </div>
    )
}