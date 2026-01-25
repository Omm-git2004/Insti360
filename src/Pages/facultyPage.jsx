import { useState } from "react";
import { useSelector } from "react-redux";
import ShowAssignments from "../Components/ShowAssignments";
import ShowFaculty from "../Components/ShowFaculty";
import ShowExams from "../Components/ShowExams";
import { useNavigate } from "react-router-dom";
import ShowInstitute from "../Components/ShowInstitute";
import Announcement from "../Components/Announcement";
import { useAuthenticateContext } from "../Context_API/Authentication";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { useSideBarActiveContext } from "../Context_API/SideBarActivation";
import TakeAttendance from "../Components/Faculty/TakeAttendance";

const FacultyPage = () => {

    const { data: facultyData } = useSelector(state => state.faculty)
    const { data: departmentData } = useSelector(state => state.department)
    const { data: instituteData } = useSelector(state => state.institute)

    const { logout } = useAuthenticateContext()
    const { activeSideBar, setActiveSideBar } = useSideBarActiveContext()

    const [showField, setShowField] = useState("account")
    const navigate = useNavigate()

    const toggleSidebar = () => {
        setActiveSideBar(!activeSideBar)
    };

    const showPanelContent = (content) => {
        setShowField(content)
        toggleSidebar()
    }

    return (
        facultyData
            ? <section className="user-panel">
                <div className="hamburger-menu">
                    <button className="hamburger-button" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faCompass} spin />
                    </button>
                </div>
                <div className={`sidebar ${activeSideBar ? "active" : ""}`}>
                    <h2>Faculty DashBoard</h2>
                    <button onClick={() => showPanelContent("account")} className={`panel-buttton ${showField === "account" && "active"}`}>My Account</button>
                    <button onClick={() => showPanelContent("institute")} className={`panel-buttton ${showField === "institute" && "active"}`}>Institute Account</button>
                    <button onClick={() => showPanelContent("instituteAnn")} className={`panel-buttton ${showField === "instituteAnn" && "active"}`} >Institute Announcement</button>
                    <button onClick={() => navigate(`/institute/${instituteData.instituteId}/department/${departmentData.departmentName}`)} >Department Account</button>
                    <button onClick={() => showPanelContent("assignments")} className={`panel-buttton ${showField === "assignments" && "active"}`}>Assignments</button>
                    <button onClick={() => showPanelContent("exams")} className={`panel-buttton ${showField === "exams" && "active"}`} >Exams</button>
                    <button onClick={() => showPanelContent("attendance")} className={`panel-buttton ${showField === "attendance" && "active"}`} >Attendance</button>
                    <button onClick={logout} >Logout</button>
                </div>
                <div className="main-content">
                    {showField === "institute" && <ShowInstitute />}
                    {showField === "instituteAnn" && <Announcement deptId={departmentData._id} announcements={instituteData.announcements} batchName={null} type={null} instituteId={instituteData.instituteId} />}
                    {showField === "account" && <ShowFaculty faculty={facultyData} />}
                    {showField === "assignments" && <ShowAssignments type={"faculty"} deptId={departmentData._id} subjects={facultyData.subjects} teacherName={facultyData.facultyName} />}
                    {showField === "exams" && <ShowExams instituteId={instituteData.instituteId} deptName={departmentData.departmentName} deptId={departmentData._id} subjects={facultyData.subjects} />}
                    {showField === "attendance" && <TakeAttendance instituteId={instituteData.instituteId} deptName={departmentData.departmentName} deptId={departmentData._id} subjects={facultyData.subjects} />}
                </div>
            </section>
            : <p>Loading Faculty Data...</p>
    )
}

export default FacultyPage;