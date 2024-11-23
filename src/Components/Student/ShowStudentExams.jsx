import { useEffect, useRef, useState } from "react"
import ShowSubjects from "../ShowSubjects"
import axios from "axios"
import { toast } from "react-toastify"
import StudentExamList from "./StudentExamList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"

export default ({ batchName, deptName, deptId, subjects }) => {

    const [canShow, setCanShow] = useState(false)
    const [exams, setExams] = useState([])

    const [currentTime, setCurrentTime] = useState("")
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10).toString())

    let intervalRef = useRef(null);

    const startInterval = () => {
        intervalRef.current = setInterval(() => {
            let temp = new Date().toString().split(" ")[4].split(":")
            setCurrentTime(parseInt(temp[0] * 60 + parseInt(temp[1])))
        }, 1000)
    }

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null;
        }
    }

    useEffect(() => {
        return () => {
            // Cleanup on component unmount i.e. if another component being opened
            stopInterval();
        };
    }, []);

    const getExams = (subject) => {
        const encodedSubject = encodeURIComponent(subject)
        axios.get(`student/getExams/?deptId=${deptId}&batchName=${batchName}&subject=${encodedSubject}`)
            .then(res => {
                const { status, message } = res.data;
                setExams(message)
                setCanShow(true)
                startInterval()
            })
            .catch(err => {
                console.error(`Retrieving student exams --> ${err}`)
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
                <div className="departmentList-container">
                    {
                        !canShow && <ShowSubjects subjects={subjects} onClick={getExams} />
                    }
                </div>
                {
                    canShow && <>
                        <div className="btn-container">
                            <button
                                onClick={() => {
                                    setCanShow(false);
                                    stopInterval()
                                }}
                                className="close-btn blue-btn"
                            > <FontAwesomeIcon icon={faArrowLeftLong} /> </button>
                        </div>
                        <StudentExamList exams={exams} date={date} currentTime={currentTime} />
                    </>
                }
            </div>
        </div>
    )
}