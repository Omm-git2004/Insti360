import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { addStudent_dept, removeStudent_dept } from "../Redux_Components/Features/departmentSlice.mjs";
import { useDispatch, useSelector } from "react-redux";
import { addOneStudent_batch, addStudentInfos, modifyStudent_batch, removeStudentInfo_batch } from "../Redux_Components/Features/batchSlice.mjs";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { useConfidentialContext } from "../Context_API/Confidential";
import FormPopUp from "./Others/FormPopUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus, faSpinner, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "./Others/PopWindow";

export default ({ studentList, deptId, batchName }) => {

    const { confidentialPassword } = useConfidentialContext()


    const [studentData, setStudentData] = useState(null) // to hold the modifing student data
    const { data: instiData } = useSelector(state => state.institute);
    const { studentData: studentInfos } = useSelector(state => state.batch)
    const { data: departmentData } = useSelector(state => state.department)
    const { data: admin } = useSelector(state => state.admin)

    const [canAddStudent, setCanAddStudent] = useState(false)
    const [removeStudent_id, setRemoveStudent_id] = useState(null)
    const [canModifyStudent, setCanModifyStudent] = useState(false)

    const dispatch = useDispatch()

    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext()

    useEffect(() => {
        axios.post(`admin/getStudentInfos`, { studentList })
            .then(res => {
                const { status, message } = res.data;
                if (status) dispatch(addStudentInfos(message))
            })
            .catch(err => {
                console.error(`Retrieving Student Information --> ${err}`)
                toast("Network connection error")
            })
    }, [])

    const queryParams = {
        instituteId: instiData?.instituteId,
        instituteName: instiData?.instituteName,
        institutePass: confidentialPassword,
        departmentId: departmentData?._id,
        departmentName: departmentData?.departmentName,
        headOfDepartment: departmentData?.headOfDepartment,
        batchName: batchName,
    };

    // Serialize the object into a query string
    const queryString = new URLSearchParams(queryParams).toString();

    const removeStudent = (sid) => {
        setIsRemoving(true)
        axios.delete(`admin/handleStudentAccount/?${queryString}&studentId=${sid}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message)

                if (status) {
                    dispatch(removeStudent_dept({ batchName, sid }));
                    dispatch(removeStudentInfo_batch(sid));
                }
            })
            .catch(err => {
                console.error(`Removing Student --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => {
                setIsRemoving(false)
                setRemoveStudent_id(null)
            })
    }

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setStudentData({
            ...studentData,
            [name]: value
        })
    }

    const saveModifiedStudentData = (e) => {

        e.preventDefault()

        setIsloading(true)
        axios.put(`admin/handleStudentAccount/?${queryString}`, studentData)
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message)

                dispatch(modifyStudent_batch(studentData))
                setStudentData(null)
                setCanModifyStudent(false)
                toast("Student Information modified successfully")

            })
            .catch(err => {
                console.error(`Modifing Student --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => {
                setIsloading(false)
            })
    }

    const requestUpdate = (student) => {

        setStudentData({ // NEEDS TO IMPLEMENT RFID TAG UPDATION
            _id: student?._id,
            firstName: student?.studentName.firstName,
            lastName: student?.studentName.lastName,
            studentEmail: student?.studentEmail,
            studentId: student?.studentId,
            studentDOB: student?.studentDOB
        })
    }

    const formElems = [
        { type: "text", placeholder: "Enter first name", onChange: (e) => handleChanges(e), name: "firstName", label: "First Name", defaultValue: studentData?.firstName },
        { type: "text", placeholder: "Enter last name", onChange: (e) => handleChanges(e), name: "lastName", label: "Last Name", defaultValue: studentData?.lastName },
        { type: "email", placeholder: "Enter Student Mail", onChange: (e) => handleChanges(e), name: "studentEmail", label: "Student Mail", defaultValue: studentData?.studentEmail },
        { type: "text", placeholder: "Enter Student Id", onChange: (e) => handleChanges(e), name: "studentId", label: "Student Id", defaultValue: studentData?.studentId },
        { type: "date", placeholder: "Enter Student DOB", onChange: (e) => handleChanges(e), name: "studentDOB", label: "Student DOB", defaultValue: studentData?.studentDOB },
        { type: "text", placeholder: "Enter Student RFID", onChange: (e) => handleChanges(e), name: "studentRFIDUniqueId", label: "Student RFID", defaultValue: studentData?.studentRFIDUniqueId }
    ]

    const createStudent = (e) => {
        e.preventDefault()
        setIsloading(true)

        axios.post(`admin/createStudentAccount/?${queryString}`, studentData)
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message)

                setCanAddStudent(false)
                dispatch(addStudent_dept({ batchName: batchName, studentId: message._id }))
                dispatch(addOneStudent_batch(message))
            })
            .catch(err => {
                console.error(`Adding Student --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => setIsloading(false))
    }

    const handleCancel = () => {
        setCanAddStudent(false);
        setStudentData(null)
    }

    return (
        <section className="departmentList-wrapper">
            <div className="header">
                <h2>Student&nbsp;List</h2>
            </div>
            <div>
                {
                    canAddStudent && <FormPopUp onClose={handleCancel} onSubmit={createStudent} formElems={formElems} />
                }
                {
                    canModifyStudent && <FormPopUp onClose={() => setCanModifyStudent(false)} onSubmit={saveModifiedStudentData} formElems={formElems} />
                }
                {
                    !canAddStudent && admin && <div>
                        <button
                            type="button"
                            onClick={() => { requestUpdate(null); setCanAddStudent(true) }}
                            disabled={isloading || isRemoving}
                            className="add-btn">
                            <FontAwesomeIcon icon={faPlus} /> Add Student
                        </button>
                    </div>
                }
            </div>
            {
                studentInfos.length > 0
                    ? <div>
                        {removeStudent_id && <PopWindow userType={"Student"} onClose={() => setRemoveStudent_id(null)} onProceed={() => removeStudent(removeStudent_id)} />}
                        <table>
                            <thead>
                                <tr>
                                    <th>Sl.No.</th>
                                    <th>SId</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>DOB</th>
                                    {admin && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    studentInfos.map(({ _id, studentId, studentName, studentDOB, studentEmail }, index) => (
                                        <tr key={_id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <p>{studentId}</p>
                                            </td>
                                            <td>
                                                <p>{studentName.firstName}</p>
                                            </td>
                                            <td>
                                                <p>{studentName.lastName}</p>
                                            </td>
                                            <td>
                                                <p>{studentEmail}</p>
                                            </td>
                                            <td>
                                                <p>{studentDOB}</p>
                                            </td>
                                            <td>
                                                {
                                                    admin && <>
                                                        <button
                                                            onClick={() => {
                                                                requestUpdate({ _id, studentName, studentEmail, studentId, studentDOB })
                                                                setCanModifyStudent(true)
                                                            }}
                                                            disabled={isloading || isRemoving}
                                                            className="tiny-btn edit-btn"
                                                        >
                                                            <FontAwesomeIcon icon={isloading ? faSpinner : faPenToSquare} spin={isloading} />
                                                        </button>
                                                        <button
                                                            onClick={() => setRemoveStudent_id(_id)}
                                                            disabled={isloading || isRemoving}
                                                            className="tiny-btn remove-btn"
                                                        >
                                                            <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} />
                                                        </button>
                                                    </>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    : <p>Student list is empty</p>
            }
        </section>
    )
}