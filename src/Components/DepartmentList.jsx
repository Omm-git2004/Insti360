import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { addDepartments } from "../Redux_Components/Features/departmentSlice.mjs"
import { useState } from "react"
import CreateDepartment from "./CreateDepartment"

import "../CSS/departmentList.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

const DepartmentList = () => {
    const { data: instituteData } = useSelector(state => state.institute)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [createBtnClicked, setCreateBtnClicked] = useState(false)

    const fetchDepartmentData = (deptId, deptName) => {
        axios.get(`admin/getDepartment/${deptId}`)
            .then(res => {
                const { status, message } = res.data;
                if (!status)
                    return toast(message)
                dispatch(addDepartments(message))
                navigate(`/institute/${instituteData.instituteId}/department/${deptName}`) // navigate to the department page
            })
            .catch(err => {
                console.error(`Retrieving department error : ${err}`)
                toast("Network connection error")
            })
    }

    return (
        <section className="departmentList-wrapper" >
            <div className="header">
                <h2>Department List</h2>
            </div>
            {
                createBtnClicked
                    ? <CreateDepartment onClose={() => setCreateBtnClicked(false)} />
                    : <div className="content">
                        <div className="btn-container">
                            <button onClick={() => setCreateBtnClicked(true)} className="create-btn">
                                <FontAwesomeIcon icon={faPlus} /> Create Department
                            </button>
                        </div>
                        <div className="departmentList-container">
                            {
                                instituteData.departments.length > 0
                                    ? instituteData.departments.map(dept => (
                                        <button
                                            key={dept.departmentId}
                                            onClick={() => fetchDepartmentData(dept.departmentId, dept.departmentName)}
                                            className="blue-btn"
                                        >
                                            {dept.departmentName}
                                        </button>
                                    ))
                                    : <p>Department List is empty</p>
                            }
                        </div>
                    </div>
            }
        </section >
    )
}

export default DepartmentList