import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useLoadingContext } from "../Context_API/LoadingContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faEdit, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { modifyDepartments } from "../Redux_Components/Features/departmentSlice.mjs"
import { modifyDepartment_insti } from "../Redux_Components/Features/instituteSlice.mjs"


export default () => {

    const { data: admin } = useSelector(state => state.admin)
    const { data: deptData } = useSelector(state => state.department)
    const { data: instituteInfo } = useSelector(state => state.institute)

    const dispatch = useDispatch()

    const { isloading, setIsloading } = useLoadingContext()

    const [canChange, setCanChange] = useState(false)


    const [modifiableDeptInfo, setModifiableDeptInfo] = useState({
        deptName: deptData?.departmentName,
        hod: deptData?.headOfDepartment
    })

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setModifiableDeptInfo({
            ...modifiableDeptInfo,
            [name]: value
        })
    }

    const handleCancel = () => {
        setCanChange(false);

        setModifiableDeptInfo({
            deptName: deptData.departmentName,
            hod: deptData.headOfDepartment
        })
    }

    const saveChanges = () => {
        setIsloading(true)
        axios.put(`admin/handleDepartment/?departmentId=${deptData._id}&instituteId=${instituteInfo._id}`, modifiableDeptInfo)
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    dispatch(modifyDepartments(modifiableDeptInfo))
                    dispatch(modifyDepartment_insti({ deptId: deptData._id, deptName: modifiableDeptInfo.deptName }))
                    document.getElementsByName("deptName")[0].value = modifiableDeptInfo.deptName.trim().toUpperCase()
                    setCanChange(false)
                }
                toast(message)
            })
            .catch(err => {
                console.error(`Department Modification error --> ${err}`)
                toast("Network connectio error")
            })
            .finally(() => setIsloading(false))
    }

    const formElems = [
        { type: "text", name: "deptName", placeholder: "Enter The Department Name", label: "Department Name", defaultValue: modifiableDeptInfo.deptName, onChange: handleChanges },
        { type: "text", name: "hod", placeholder: "Enter The Head of department name", label: "Head Of Department", defaultValue: modifiableDeptInfo.hod, onChange: handleChanges }
    ]

    return (
        <div className="account-container">
            <div className="header">
                <h2>Department Account</h2>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="account-form" >
                {
                    formElems.map(({ type, name, placeholder, label, defaultValue, onChange }) => (
                        <div key={name} className="form-group">
                            <label htmlFor={name}>{label}</label>
                            <input type={type} name={name} id={name} defaultValue={defaultValue} onChange={onChange} placeholder={placeholder} disabled={!canChange} />
                        </div>
                    ))
                }
                <div className="edit-buttons">
                    {
                        canChange
                            ? <div>
                                <button onClick={saveChanges} disabled={isloading} className="save-btn">
                                    <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                    {isloading ? " Saving Changes..." : " Save Changes"}
                                </button>
                                <button onClick={handleCancel} disabled={isloading} className="cancel-btn">
                                    <FontAwesomeIcon icon={faBan} spin /> Cancel
                                </button>
                            </div>
                            : admin && <button onClick={() => setCanChange(true)} disabled={isloading} className="violet-btn" > <FontAwesomeIcon icon={faEdit} /> Modify</button>
                    }
                </div>
            </form>
        </div>
    )
}