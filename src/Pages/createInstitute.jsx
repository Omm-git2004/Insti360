import { useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addAdmin } from "../Redux_Components/Features/adminSlice.mjs"
import { addInstitute } from "../Redux_Components/Features/instituteSlice.mjs"
import { useConfidentialContext } from "../Context_API/Confidential"

const CreateInstitute = () => {

    const { setConfidentialPassword } = useConfidentialContext()

    const [infos, setInfos] = useState({
        adminEmail: "",
        adminFirstName: "",
        adminLastName: "",
        adminPass: "",
        designation: "",
        mobileNumber: "",
        instituteId: "",
        instituteName: "",
        institutePass: ""
    })

    const [confirmPass, setConfirmPass] = useState("")
    const [confirmInstiPass, setConfirmInstiPass] = useState("")
    const [canProceed, setCanProceed] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleUpdate = (e) => {
        const { name, value } = e.target;
        setInfos({
            ...infos,
            [name]: value
        })
    }

    const adminInputFields = [
        { type: "email", label: "Email", name: "adminEmail", change: handleUpdate, placeholder: "Mail Id", defaultValue: infos.adminEmail, required: true },
        { type: "text", label: "First Name", name: "adminFirstName", change: handleUpdate, placeholder: "First Name", defaultValue: infos.adminFirstName, required: true },
        { type: "text", label: "Last Name", name: "adminLastName", change: handleUpdate, placeholder: "Last Name", defaultValue: infos.adminLastName, required: true },
        { type: "text", label: "Password", name: "adminPass", change: handleUpdate, placeholder: "Admin Password", defaultValue: infos.adminPass, required: true },
        { type: "password", label: "Confirm Password", name: "confirmPass", change: (e) => setConfirmPass(e.target.value), placeholder: "Confirm Password", defaultValue: confirmPass, required: true },
        { type: "text", label: "Designation", name: "designation", change: handleUpdate, placeholder: "Designation", defaultValue: infos.designation, required: true },
        { type: "text", label: "Mobile Number", name: "mobileNumber", change: handleUpdate, placeholder: "Mobile Number", defaultValue: infos.mobileNumber, required: true },

    ]

    const instituteInputFields = [
        { type: "text", label: "Institute Id", name: "instituteId", change: handleUpdate, placeholder: "Institute Id", defaultValue: infos.instituteId, required: true },
        { type: "text", label: "Institute Name", name: "instituteName", change: handleUpdate, placeholder: "Institute Name", defaultValue: infos.instituteName, required: true },
        { type: "text", label: "Institute Pass", name: "institutePass", change: handleUpdate, placeholder: "Institute Password", defaultValue: infos.institutePass, required: true },
        { type: "password", label: "Confirm Pass", name: "confirmInstiPass", change: (e) => setConfirmInstiPass(e.target.value), placeholder: "Confirm Password", defaultValue: confirmInstiPass, required: true },
    ]

    const handleSubmit = (e) => {
        e.preventDefault()

        if (confirmInstiPass !== infos.institutePass)
            return toast("Institute Password and Confirm Password must be same")

        axios.post("admin/createInstitute", infos)
            .then(res => {
                const { status, message } = res.data;

                if (!status)
                    return toast(message)
                else {
                    const { admin, institute } = message;
                    dispatch(addAdmin({ admin, isSuperAdmin: true }))
                    dispatch(addInstitute(institute))
                    setConfidentialPassword(infos.institutePass)
                    navigate(`/institute/${institute.instituteId}/admin`) //navigate to the admin page
                }
            })
            .catch(err => {
                console.error(`Institute creation error --> ${err}`)
                toast("Network connection error")
            })
    }

    const handleAdminAccount = () => {
        if (confirmPass !== infos.adminPass)
            return toast("Admin Password and Confirm Password must be same")

        setCanProceed(true)
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>
                    {
                        canProceed
                            ? "Create Institute Account"
                            : "Create Admin Account"
                    }
                </h2>
                <form>
                    {
                        canProceed
                            ? instituteInputFields.map(({ type, label, name, change, placeholder, defaultValue, required }) => (
                                <div className="form-group">
                                    <label htmlFor={name}>{label}</label>
                                    <input type={type} name={name} id={name} onChange={change} placeholder={`Enter ${placeholder}`} key={name} defaultValue={defaultValue} required={required} />
                                </div>
                            ))
                            : adminInputFields.map(({ type, label, name, change, placeholder, defaultValue, required }) => (
                                <div className="form-group">
                                    <label htmlFor={name}>{label}</label>
                                    <input type={type} name={name} id={name} onChange={change} placeholder={`Enter ${placeholder}`} key={name} defaultValue={defaultValue} required={required} />
                                </div>
                            ))
                    }
                    {
                        canProceed
                            ? <div>
                                <button type="button" style={{ marginBottom: "5px" }} onClick={handleSubmit} >Create Institute Account</button>
                                <button type="button" onClick={() => setCanProceed(false)} >Back</button>
                            </div>
                            : <div>
                                <button type="button" style={{ marginBottom: "5px" }} onClick={handleAdminAccount}  >Create Admin Account</button>
                                <button type="button" onClick={() => navigate(-1)} >Cancel</button>
                            </div>
                    }
                </form>
            </div>
        </div>
    )
}

export default CreateInstitute