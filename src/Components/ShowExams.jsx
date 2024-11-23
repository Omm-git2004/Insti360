import { useState } from "react"
import ShowSubjects from "./ShowSubjects"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import ExamList from "./ExamList"
import { useSelector } from "react-redux"
import { faArrowLeftLong, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default ({ instituteId, deptName, deptId, subjects }) => {
    const [canShowExam, setCanShowExam] = useState(false)
    const [examInfos, setExamInfos] = useState([])
    const [currentSubject, setCurrentSubject] = useState(null)

    const { data: admin } = useSelector(state => state.admin)

    const navigate = useNavigate()

    const getExam = (subject) => {
        const encodedPaperName = encodeURIComponent(subject)
        axios.get(`faculty/getExams/?deptId=${deptId}&subject=${encodedPaperName}`)
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message)
                setCurrentSubject(subject)
                setExamInfos(message)
                setCanShowExam(true)
            })
            .catch(err => {
                console.error(`Retrieving exam information --> ${err}`)
                if (err.response.status === 404) return toast(err.response.data.message)
                toast("Network connection error")
            })
    }

    return (
        <div className="departmentList-wrapper">
            <div className="header">
                <h2>Exam List</h2>
            </div>
            <div className="content">
                {
                    canShowExam && <div className="btn-container">
                        <button
                            onClick={() => setCanShowExam(false)}
                            className="close-btn blue-btn"
                        >
                            <FontAwesomeIcon icon={faArrowLeftLong} />
                        </button>
                        {!admin && <button
                            onClick={() => navigate(`/institute/${instituteId}/department/${deptName}/exam/${currentSubject}`, { state: { deptId: deptId, subject: currentSubject } })}
                            className="create-btn"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Create Exam
                        </button>}
                    </div>
                }
                <div className="departmentList-container">
                    {
                        !canShowExam
                            ? <ShowSubjects subjects={subjects} onClick={getExam} />
                            : <ExamList exams={examInfos} deptId={deptId} setExams={setExamInfos} getExams={getExam} />
                    }
                </div>
            </div>
        </div>
    )
}