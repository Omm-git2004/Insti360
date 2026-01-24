import { useDispatch, useSelector } from "react-redux"
import { statusCode } from "../utils/statusFile.mjs"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { modifyDepartments, removeDepartments } from "../Redux_Components/Features/departmentSlice.mjs"
import { modifyDepartment_insti, removeDepartment_institute } from "../Redux_Components/Features/instituteSlice.mjs"
import Announcement from "../Components/Announcement"
import FacultyList from "../Components/FacultyList"
import BatchList from "../Components/BatchList"
import { useNavigate } from "react-router-dom"
import DepartmentAdmin from "../Components/DepartmentAdmin"
import PaperList from "../Components/PaperList"
import { useLoadingContext } from "../Context_API/LoadingContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCompass } from "@fortawesome/free-solid-svg-icons"
import { useSideBarActiveContext } from "../Context_API/SideBarActivation"
import ShowDepartment from "../Components/ShowDepartment"
import PopWindow from "../Components/Others/PopWindow"

const DepartmentPage = () => {

    const { data: deptData, status: deptStatus } = useSelector(state => state.department)
    const { data: instituteInfo } = useSelector(state => state.institute)
    const { isSuperAdmin } = useSelector(state => state.admin)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isloading, isRemoving, setIsRemoving } = useLoadingContext()
    const { activeSideBar, setActiveSideBar } = useSideBarActiveContext()


    const [showField, setShowField] = useState("account")

    const deleteDept = () => {
        setIsRemoving(true)
        axios.delete(`admin/handleDepartment/?departmentId=${deptData._id}&instituteId=${instituteInfo.instituteId}`)
            .then(res => {
                setIsRemoving(false)
                const { status, message } = res.data;
                toast(message)

                if (status) {
                    dispatch(removeDepartment_institute(deptData._id))
                    dispatch(removeDepartments())
                    navigate(-1) // navigate back to the previous page i.e. the admin page
                }
            })
            .catch(err => {
                setIsRemoving(false)
                console.error(`Department Deletion error --> ${err}`)
                toast("Network connection error")
            })
    }

    const toggleSidebar = () => {
        setActiveSideBar(!activeSideBar)
    };

    const showPanelContent = (content) => {
        setShowField(content)
        toggleSidebar()
    }

    return (
        deptStatus === statusCode.IDLE
            ? <section className="user-panel" >
                {showField === "removeDepartment" && <PopWindow userType={"Department"} onClose={() => showPanelContent("account")} onProceed={deleteDept} />}
                <div className="hamburger-menu">
                    <button className="hamburger-button" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faCompass} spin />
                    </button>
                </div>
                <div className={`sidebar ${activeSideBar ? "active" : ""}`}>
                    <h2>Department DashBoard</h2>

                    <button onClick={() => showPanelContent("account")} className={`panel-buttton ${showField === "account" && "active"}`} >Account</button>
                    {isSuperAdmin && <button onClick={() => showPanelContent("showAdmin")} className={`panel-buttton ${showField === "showAdmin" && "active"}`}>Department Admin</button>}
                    <button onClick={() => showPanelContent("facultyList")} disabled={isloading || isRemoving} className={`panel-buttton ${showField === "facultyList" && "active"}`} >Faculty List</button>
                    <button onClick={() => showPanelContent("batchList")} disabled={isloading || isRemoving} className={`panel-buttton ${showField === "batchList" && "active"}`} >Batch List</button>
                    <button onClick={() => showPanelContent("announcement")} disabled={isloading || isRemoving} className={`panel-buttton ${showField === "announcement" && "active"}`} >Announcement</button>
                    <button onClick={() => showPanelContent("papers")} disabled={isloading || isRemoving} className={`panel-buttton ${showField === "papers" && "active"}`} >Papers</button>
                    <button onClick={()=> navigate("/department/punchIn")} disabled={isloading || isRemoving} className={`panel-buttton`} >PUNCH IN</button>
                    <button onClick={() => navigate("/department/punchOut")} disabled={isloading || isRemoving} className={`panel-buttton`} >PUNCH OUT</button>
                    {isSuperAdmin && <button onClick={() => setShowField("removeDepartment")} disabled={isloading || isRemoving} >{isRemoving ? "Deleting" : "Delete Department"}</button>}
                    <button onClick={() => navigate(-1)} disabled={isloading || isRemoving} >Go Back</button> {/* Go to the admin page */}

                </div>
                <div className="main-content">
                    <div>
                        {showField === "account" && <ShowDepartment />}
                        {showField === "showAdmin" && <DepartmentAdmin deptId={deptData._id} />}
                        {showField === "facultyList" && <FacultyList deptId={deptData._id} faculties={deptData.facultyList} />}
                        {showField === "batchList" && <BatchList batchList={deptData.batches} deptId={deptData._id} />}
                        {showField === "announcement" && <Announcement deptId={deptData._id} announcements={deptData.announcements} batchName={null} type={"Department"} />}
                        {showField === "papers" && <PaperList deptId={deptData._id} papers={deptData.papers} />}
                    </div>
                </div>
            </section>
            : <div>
                Something went wrong
            </div>


    )
}

export default DepartmentPage;