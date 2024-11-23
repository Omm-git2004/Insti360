import { useSelector } from "react-redux";
import { statusCode } from "../utils/statusFile.mjs";
import { useState } from "react";
import DepartmentList from "../Components/departmentList";
import Announcement from "../Components/Announcement";
import { useNavigate } from "react-router-dom";
import ShowAdmin from "../Components/ShowAdmin";
import ShowInstitute from "../Components/ShowInstitute";
import Premium from "../Components/Premium";
import { useAuthenticateContext } from "../Context_API/Authentication";
import axios from "axios";
import { toast } from "react-toastify";

import { useSideBarActiveContext } from "../Context_API/SideBarActivation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCompass } from "@fortawesome/free-solid-svg-icons"
import { removeAdmin } from "../Redux_Components/Features/adminSlice.mjs";
import { removeInstiute } from "../Redux_Components/Features/instituteSlice.mjs";
import { useLoadingContext } from "../Context_API/LoadingContext";
import PopWindow from "../Components/Others/PopWindow";

const AdminPage = () => {
    const { status: adminStatus, isSuperAdmin } = useSelector(state => state.admin)
    const { data: instituteData } = useSelector(state => state.institute)
    const { data: deptData } = useSelector(state => state.department)

    const { activeSideBar, setActiveSideBar } = useSideBarActiveContext()

    const { isloading, isRemoving, setIsRemoving } = useLoadingContext()

    const [showField, setShowField] = useState("account")
    const { logout } = useAuthenticateContext()

    const navigate = useNavigate()

    const toggleSidebar = () => {
        setActiveSideBar(!activeSideBar)
    };

    const removeAccount = () => {
        setIsRemoving(true)
        axios.delete(`admin/removeSuperAdminAccount/${instituteData.instituteId}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message)
                if (status) {
                    dispatch(removeInstiute())
                    dispatch(removeAdmin())
                }
            })
            .catch(err => {
                console.error(`Removing Institute --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => setIsRemoving(false))
    }

    const showPanelContent = (content) => {
        setShowField(content)
        toggleSidebar()
    }

    return (
        adminStatus === statusCode.IDLE && <section className="user-panel">
            {showField === "removeAccount" && <PopWindow onClose={() => showPanelContent("account")} onProceed={removeAccount} userType={"Institute"} />}
            <div className="hamburger-menu">
                <button className="hamburger-button" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faCompass} spin />
                </button>
            </div>
            <div className={`sidebar ${activeSideBar ? "active" : ""}`}>
                <h2>Admin DashBoard</h2>
                <button onClick={() => showPanelContent("account")} className={`panel-buttton ${showField === "account" && "active"}`} >My Account</button>
                <button onClick={() => showPanelContent("institute")} className={`panel-buttton ${showField === "institute" && "active"}`}>Institute Account</button>
                <button onClick={() => showPanelContent("announcement")} className={`panel-buttton ${showField === "announcement" && "active"}`}>Announcements</button> {/* Institute announcement */}
                {
                    !isSuperAdmin
                        ? <button onClick={() => navigate(`/institute/${instituteData.instituteId}/department/${deptData.departmentName}`)}>Department</button> // Visit the department page
                        : <>
                            <button onClick={() => showPanelContent("departmentList")} className={`panel-buttton ${showField === "departmentList" && "active"}`} >Department List</button>
                            <button onClick={() => showPanelContent("premium")} className={`panel-buttton ${showField === "premium" && "active"}`}>Premium</button>
                            <button onClick={() => setShowField("removeAccount")} disabled={isloading || isRemoving} >
                                {isRemoving ? " Removing..." : " Remove Account"}
                            </button>
                        </>
                }
                <button onClick={logout} >LogOut</button>
            </div>
            <div className="main-content">
                {showField === "account" && <ShowAdmin />} {/* Show the admin information */}
                {showField === "institute" && <ShowInstitute />}
                {showField === "departmentList" && <DepartmentList />}
                {showField === "announcement" && <Announcement type={"Institute"} announcements={instituteData.announcements} instituteId={instituteData._id} />}
                {showField === "premium" && <Premium />}
            </div>
        </section>

    )
}

export default AdminPage;