import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { addFaculty_dept } from "../Redux_Components/Features/departmentSlice.mjs"
import { useLoadingContext } from "../Context_API/LoadingContext"
import { useConfidentialContext } from "../Context_API/Confidential"
import FormPopUp from "./Others/FormPopUp"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons"

export default ({ deptId, close }) => {

    const { data: instituteInfo } = useSelector(state => state.institute)
    const { data: deptInfo } = useSelector(state => state.department)

    const { isloading, setIsloading } = useLoadingContext()
    const { confidentialPassword } = useConfidentialContext()

    const queryParams = {
        instituteId: instituteInfo?.instituteId,
        instituteName: instituteInfo?.instituteName,
        institutePass: confidentialPassword,
        departmentId: deptInfo?._id,
        departmentName: deptInfo?.departmentName,
        headOfDepartment: deptInfo?.headOfDepartment,
    };

    // Serialize the object into a query string
    const queryString = new URLSearchParams(queryParams).toString();

    const [facultyData, setFacultyData] = useState({
        firstName: "",
        lastName: "",
        facultyEmail: "",
        designation: "",
        facultyId: "",
        subjects: []
    })

    const dispatch = useDispatch()

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setFacultyData({
            ...facultyData,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsloading(true)

        axios.post(`admin/createFacultyAccount/?${queryString}`, facultyData)
            .then(res => {
                setIsloading(false)
                const { status, message } = res.data;

                if (!status) return toast(message)

                dispatch(addFaculty_dept(message))
                close()
            })
            .catch(err => {
                setIsloading(false)
                console.error(`Creating faculty -->${err}`)
                toast("Network connection error")
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

    const removeSubject = (index) => {
        let tempSub = [...facultyData.subjects];
        tempSub.splice(index, 1);
        setFacultyData({
            ...facultyData,
            subjects: tempSub
        })
    }

    const formElems = [
        { type: "text", name: "firstName", placeholder: "Enter the first name", onChange: (e) => handleChanges(e), label: "First Name" },
        { type: "text", name: "lastName", placeholder: "Enter the last name", onChange: (e) => handleChanges(e), label: "Last Name" },
        { type: "email", name: "facultyEmail", placeholder: "Enter the Mail Id", onChange: (e) => handleChanges(e), label: "Faculty Email" },
        { type: "text", name: "designation", placeholder: "Enter the designation", onChange: (e) => handleChanges(e), label: "Designation" },
        { type: "text", name: "facultyId", placeholder: "Enter the faculty Id", onChange: (e) => handleChanges(e), label: "Faculty Id" }
    ]

    return (
        <FormPopUp onClose={close} onSubmit={handleSubmit} formElems={formElems} >
            <div>
                <label>Papers</label>
                {
                    facultyData.subjects.length > 0 && facultyData.subjects.map((sub, index) => (
                        <div>
                            <select name="subjects" onChange={(e) => handleSubjects(e.target.value, index)} value={sub} key={sub + index} >
                                <option value="" disabled>choose paper</option>
                                {
                                    deptInfo.papers.map(({ name, semester }) => (
                                        <option value={name}>{name.toUpperCase()}</option>
                                    ))
                                }
                            </select>
                            <button type="button" onClick={() => removeSubject(index)} disabled={isloading} className="tiny-btn remove-btn" >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                        </div>
                    ))
                }

                <button type="button" onClick={addSubject} disabled={isloading} className="add-btn">
                    <FontAwesomeIcon icon={faPlus} /> Add Paper
                </button>
            </div>
        </FormPopUp>
    )
}