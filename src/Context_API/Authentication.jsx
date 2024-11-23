import { createContext, useContext, useEffect, useState } from "react";
import { useLoadingContext } from "./LoadingContext";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addAdmin, removeAdmin } from "../Redux_Components/Features/adminSlice.mjs";
import { addDepartments, removeDepartments } from "../Redux_Components/Features/departmentSlice.mjs";
import { addFaculty, removeFaculty } from "../Redux_Components/Features/facultySlice.mjs";
import { addStudent, removeStudent } from "../Redux_Components/Features/studentSlice.mjs";
import { addBatch, removeBatch } from "../Redux_Components/Features/batchSlice.mjs";
import { toast } from "react-toastify";
import { addInstitute, removeInstiute } from "../Redux_Components/Features/instituteSlice.mjs";
import { useNavigate } from "react-router-dom"
import { useConfidentialContext } from "./Confidential";

const AuthenticateContext = createContext()

export const useAuthenticateContext = () => useContext(AuthenticateContext)

export const AuthenticateProvider = ({ children }) => {
    const { setIsAuthenticating } = useLoadingContext()
    const { setConfidentialPassword } = useConfidentialContext()

    const [successAuthentication, setSuccessAuthentication] = useState(false)
    const [accountUrl, setAccountUrl] = useState("")

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const authenticateUser = () => {

        axios.get("authenticate")
            .then(res => {
                const { status, message } = res.data;
                const { userType, department, institute } = message

                if (!status) return toast(message)

                dispatch(addInstitute(institute))
                // store the institute password

                switch (userType) {
                    case "faculty":
                        const { faculty } = message
                        dispatch(addFaculty(faculty))
                        dispatch(addDepartments(department))

                        setAccountUrl(`/institute/${institute.instituteId}/department/${department.departmentName}/faculty/${faculty.facultyId}`)
                        setSuccessAuthentication(true)

                        break;
                    case "student":
                        const { student, batch } = message;
                        dispatch(addStudent(student))
                        dispatch(addBatch(batch))
                        dispatch(addDepartments(department))

                        setAccountUrl(`/institute/${institute.instituteId}/student/${student.studentId}`)
                        setSuccessAuthentication(true)

                        break;
                    default: // for admin
                        const { admin, isSuperAdmin, confidential } = message;
                        dispatch(addAdmin({ admin, isSuperAdmin }))
                        !isSuperAdmin && dispatch(addDepartments(department))

                        setAccountUrl(`/institute/${institute.instituteId}/admin`)
                        setSuccessAuthentication(true)
                        setConfidentialPassword(confidential)
                }
            })
            .catch(err => {
                console.error(`Authenticating Error : ${err}`)
                setSuccessAuthentication(false)
                if (err.response.status === 404) return toast(err.response.data)
            })
            .finally(() => setIsAuthenticating(false))
    }

    const logout = () => {
        axios.get("logout")
            .then(res => {
                if (res.data == true) {
                    //Remove Data from redux

                    dispatch(removeAdmin())
                    dispatch(removeDepartments())
                    dispatch(removeInstiute())
                    dispatch(removeBatch())
                    dispatch(removeFaculty())
                    dispatch(removeStudent())

                    setSuccessAuthentication(false)
                    setAccountUrl("")
                    navigate("/") // navigate to the home page
                }
            })
            .catch(err => {
                console.error(`Logout error : ${err}`)
            })
            .finally(() => {
                setSuccessAuthentication(false)
                setAccountUrl("")
            })
    }

    useEffect(() => {
        authenticateUser()
    }, [])

    return (
        <AuthenticateContext.Provider value={{ authenticateUser, successAuthentication, setSuccessAuthentication, accountUrl, setAccountUrl, logout }} >
            {children}
        </AuthenticateContext.Provider>
    )

}