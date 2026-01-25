import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import axios from "axios"
import { toast } from "react-toastify"
import { modifyBatch, removeBatch, updateSemester } from "../Redux_Components/Features/batchSlice.mjs";
import { removeBatch_dept } from "../Redux_Components/Features/departmentSlice.mjs";
import { useLocation, useNavigate } from "react-router-dom";
import Announcement from "../Components/Announcement";
import StudentList from "../Components/StudentList";
import ShowAssignments from "../Components/ShowAssignments";
import ShowExams from "../Components/ShowExams";
import ShowBatch from "../Components/ShowBatch";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { useSideBarActiveContext } from "../Context_API/SideBarActivation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "../Components/Others/PopWindow";
import ShowAttendance from "../Components/ShowAttendance";
import FormPopUp from "../Components/Others/FormPopUp";

const BatchPage = () => {
    const loc = useLocation()
    const deptId = loc?.state;

    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext()
    const { activeSideBar, setActiveSideBar } = useSideBarActiveContext()

    const { data: batchData } = useSelector(state => state.batch)
    const { data: instiData } = useSelector(state => state.institute)
    const { data: admin } = useSelector(state => state.admin)
    const { data: deptData } = useSelector(state => state.department)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [subjects, setSubjects] = useState([])
    const [showField, setShowField] = useState("account")

    const [canRemoveBatch, setCanRemoveBatch] = useState(false)
    const [canUpdateBatch, setCanUpdateBatch] = useState(false)
    const [canCreateAttendance, setCanCreateAttendance] = useState(false)

    useEffect(() => {
        let temp = []
        deptData?.papers.map(paper => { if (paper.semester === batchData?.semester) temp.push(paper.name) })
        setSubjects(temp)
    }, [deptData])



    const remove = () => {
        setIsRemoving(true)
        axios.delete(`admin/handleBatch/${deptId}/?batchName=${batchData.batchName}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message)
                if (status) {
                    dispatch(removeBatch_dept(batchData.batchName))
                    dispatch(removeBatch());
                    navigate(-1) // navigate back to the department page
                }
            })
            .catch(err => {
                console.error(`Removing batch --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => {
                setIsRemoving(false)
            })
    }

    const update = () => {
        setIsloading(true)
        axios.patch(`admin/handleBatch/${deptId}/?batchName=${batchData?.batchName}`)
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message)

                dispatch(updateSemester(message));
                setCanUpdateBatch(false)
                toast("Batch is updated")
            })
            .catch(err => {
                console.error(`Updating batch --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => setIsloading(false))
    }

    const toggleSidebar = () => {
        setActiveSideBar(!activeSideBar)
    };

    const showPanelContent = (content) => {
        setShowField(content)
        toggleSidebar()
    }

    // handling the attendance creation for a batch

    const [attendanceInfo, setAttendanceInfo] = useState({
        info: [{ year: "", month: "" }]
    })

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - 10 + i);

    const addAttendance = () => {
        setAttendanceInfo({
            ...attendanceInfo,
            info: [...attendanceInfo.info, { year: "", month: "" }]
        })
    }

    const handleAttendance = (year, month, index) => {
        setAttendanceInfo((prev) => {
            const temp = [...prev.info];

            temp[index] = {
                year: year === "" ? temp[index].year : year,
                month: month === "" ? temp[index].month : month,
            };

            return {
                ...prev,
                info: temp, // ✅ correct key
            };
        });
    }

    const removeAttendance = (index) => {
        let tempAtt = [...attendanceInfo.info];
        tempAtt.splice(index, 1);
        setAttendanceInfo({
            ...attendanceInfo,
            info: tempAtt
        })
    }

    const createAttendance = (e) => {
        e.preventDefault();
        setIsloading(true)

        axios.post(`admin/createAttendance`, { instituteId: instiData.instituteId, departmentId: deptData._id, semester: batchData.semester, data: attendanceInfo.info })
            .then(res => {
                setIsloading(false)
                const { status, message } = res.data;

                toast(message)
                if (status) return closeAttendanceForm()
            })
            .catch(err => {
                setIsloading(false)
                console.error(`Creating Batch Attendance -->${err}`)
                toast("Network connection error")
            })
    }

    const closeAttendanceForm = () => {
        setCanCreateAttendance(false)
        setAttendanceInfo({ info: [{ year: "", month: "" }] })
    }


    return (
        <section className="user-panel">
            {canRemoveBatch && <PopWindow userType={"Batch"} onClose={() => setCanRemoveBatch(false)} onProceed={remove} />}
            {canUpdateBatch && <PopWindow userType={"Batch Update"} onClose={() => setCanUpdateBatch(false)} onProceed={update} />}
            {
                canCreateAttendance && <FormPopUp onClose={closeAttendanceForm} onSubmit={createAttendance} formElems={[]}>
                    <div>
                        <label>Create Attendance</label>
                        {
                            attendanceInfo.info.length > 0 && attendanceInfo.info.map((item, index) => (
                                <div key={index}>
                                    <select name="year" onChange={(e) => handleAttendance(e.target.value, "", index)} value={item.year} >
                                        <option value="" disabled>choose Year</option>
                                        {
                                            years.map((y) => (
                                                <option key={y} value={y}>{y}</option>
                                            ))
                                        }
                                    </select>

                                    <select name="month" onChange={(e) => handleAttendance("", e.target.value, index)} value={item.month} >
                                        <option value="" disabled>choose Month</option>
                                        {
                                            months.map((m) => (
                                                <option key={m} value={m}>{m}</option>
                                            ))
                                        }
                                    </select>

                                    <button type="button" onClick={() => removeAttendance(index)} disabled={isloading} className="tiny-btn remove-btn" >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                </div>
                            ))
                        }

                        <button type="button" onClick={addAttendance} disabled={isloading} className="add-btn">
                            <FontAwesomeIcon icon={faPlus} /> Add Field
                        </button>
                    </div>
                </FormPopUp>
            }
            <div className="hamburger-menu">
                <button className="hamburger-button" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faCompass} spin />
                </button>
            </div>
            <div className={`sidebar ${activeSideBar ? "active" : ""}`}>
                <h2>Batch DashBoard</h2>
                <button onClick={() => showPanelContent("account")} className={`panel-buttton ${showField === "account" && "active"}`} disabled={isloading || isRemoving} >Batch Account</button>
                <button onClick={() => showPanelContent("student")} className={`panel-buttton ${showField === "student" && "active"}`} disabled={isloading || isRemoving}>Student List</button>
                <button onClick={() => showPanelContent("announcement")} className={`panel-buttton ${showField === "announcement" && "active"}`} disabled={isloading || isRemoving} >Announcements</button>
                {
                    admin &&
                    <>
                        <button onClick={() => setCanCreateAttendance(true)} disabled={isloading || isRemoving}>Create Attendance</button>
                        <button onClick={() => showPanelContent("assignments")} className={`panel-buttton ${showField === "assignments" && "active"}`} disabled={isloading || isRemoving}>Assignments</button>
                        <button onClick={() => showPanelContent("exams")} className={`panel-buttton ${showField === "exams" && "active"}`} disabled={isloading || isRemoving}>Exams</button>
                        <button onClick={() => setCanUpdateBatch(true)} disabled={isloading || isRemoving} >Update Semester</button>
                        <button onClick={() => setCanRemoveBatch(true)} disabled={isloading || isRemoving}>Remove Batch</button>
                    </>
                }
                <button onClick={() => showPanelContent("attendance")} className={`panel-buttton ${showField === "attendance" && "active"}`} disabled={isloading || isRemoving}>Punch Status</button>
                <button onClick={() => navigate(-1)} disabled={isloading || isRemoving}>Go Back</button>
            </div>


            <div className="main-content">
                {showField === "account" && <ShowBatch />}
                {showField === "student" && <StudentList batchName={batchData?.batchName} deptId={deptId} studentList={batchData?.studentList} />}
                {showField === "assignments" && <ShowAssignments deptId={deptId} subjects={subjects} teacherName={null} type={"faculty"} isVisiting={true} />}
                {showField === "exams" && admin && <ShowExams instituteId={instiData.instituteId} deptName={deptData.departmentName} deptId={deptId} subjects={subjects} />}
                {showField === "announcement" && <Announcement deptId={deptId} announcements={batchData?.batchAnnouncements} batchName={batchData?.batchName} type={"Batch"} />}
                {showField === "attendance" && <ShowAttendance batchName={batchData?.batchName} deptId={deptId} studentList={batchData?.studentList} />}
            </div>
        </section>
    )
}

export default BatchPage;