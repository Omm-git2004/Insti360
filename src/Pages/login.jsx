import { useState } from "react";
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addInstitute } from "../Redux_Components/Features/instituteSlice.mjs";
import { useNavigate, useParams,Link } from "react-router-dom";
import { toast } from "react-toastify"
import { addAdmin } from "../Redux_Components/Features/adminSlice.mjs";
import { addDepartments } from "../Redux_Components/Features/departmentSlice.mjs";
import { addStudent } from "../Redux_Components/Features/studentSlice.mjs";
import { addBatch } from "../Redux_Components/Features/batchSlice.mjs";
import { addFaculty } from "../Redux_Components/Features/facultySlice.mjs";
import { useConfidentialContext } from "../Context_API/Confidential";
import { useAuthenticateContext } from "../Context_API/Authentication";

const Login = () => {
    {/* loginType : Admin, Student, Faculty, Institute */ }
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loginType = useParams().loginType;


    const { data: instituteInfos } = useSelector(state => state.institute)
    const { setConfidentialPassword, confidentialPassword } = useConfidentialContext()
    const { setAccountUrl, setSuccessAuthentication, successAuthentication } = useAuthenticateContext()

    const [loginInfos, setLoginInfos] = useState({
        id: null,
        password: null
    })

    const handleUpdate = (e) => {
        const { name, value } = e.target;
        setLoginInfos({
            ...loginInfos,
            [name]: value
        })
    }

    const instituteLogin = () => {
        axios.post(`${loginType.toLowerCase()}/login`, loginInfos)
            .then(res => {
                const { status, message } = res.data;

                if (!status) {
                    toast(message)
                    return;
                }
                // Save the data in redux
                dispatch(addInstitute(message))
                setConfidentialPassword(loginInfos.password)

                navigate(`/institute/${message.instituteId}`)

                setAccountUrl(`/institute/${message.instituteId}`)
            })
            .catch(err => {
                console.error(`Error at ${loginType} Login --> ${err}`)
                toast("Network connection error")
            })
    }

    const otherLogins = () => {

        axios.post(`${loginType.toLowerCase()}/login`, { loginInfos, instituteInfos, confidential: confidentialPassword })
            .then(res => {
                const { status, message } = res.data;

                if (!status)
                    return toast(message)
                else {
                    setSuccessAuthentication(true)

                    if (loginType === "Admin") {
                        const { admin, departmentInfo, isSuperAdmin } = message;
                        dispatch(addAdmin({ admin, isSuperAdmin }))
                        !isSuperAdmin && dispatch(addDepartments(departmentInfo))

                        navigate(`/institute/${instituteInfos.instituteId}/admin`) // navigate to the admin page

                        setAccountUrl(`/institute/${instituteInfos.instituteId}/admin`) // navigate to the admin page
                    }
                    else if (loginType === "Student") {
                        const { student, batch, department } = message;
                        dispatch(addStudent(student))
                        dispatch(addBatch(batch))
                        dispatch(addDepartments(department))

                        navigate(`/institute/${instituteInfos.instituteId}/student/${student.studentId}`) // navigate to student homepage
                        setAccountUrl(`/institute/${instituteInfos.instituteId}/student/${student.studentId}`) // navigate to student homepage
                    } else {
                        const { faculty, department } = message;
                        dispatch(addFaculty(faculty))
                        dispatch(addDepartments(department))
                        navigate(`/institute/${instituteInfos.instituteId}/department/${department.departmentName}/faculty/${faculty.facultyId}`)
                        setAccountUrl(`/institute/${instituteInfos.instituteId}/department/${department.departmentName}/faculty/${faculty.facultyId}`)
                    }
                }
            })
            .catch(err => {
                console.error(`Error at ${loginType} Login --> ${err}`)
                toast("Network connection error")
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (loginType === "Institute") instituteLogin()
        else otherLogins()
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>{loginType} Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email"></label>
                        <input type="text" placeholder={`Enter Your ${loginType === "Admin" ? "Admin Mail ID" : loginType + " Id"}`} name="id" onChange={handleUpdate} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"></label>
                        <input type="password" placeholder={`Enter Your Password`} name="password" onChange={handleUpdate} />
                    </div>
                    <button>Login</button>
                    {
                        loginType === "Institute"
                            ? <p>
                                <Link to="/createInstitute" >Create Institute</Link>
                            </p>
                            : <p>
                                <Link to={`/generateOtp/${loginType.toLowerCase()}`} >Forgot Password</Link>
                            </p>
                    }
                </form>
            </div>
            <div className="login-image">
                <img src={`/banner.png`} alt="loginBanner" />
            </div>
        </div>
    )
}

export default Login;

// This page will handle all type of logins 
/* 
    if Institute login then after succeessfully logging into institute account it will navigate to the userLogin page
    if Admin login then check whether the admin is super admin or not
        if super admin then navigate to the admin page
        else dispatch the addDepartment method, navigate to the admin page
*/