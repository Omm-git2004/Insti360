import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { statusCode } from "../utils/statusFile.mjs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faCalendar, faClock, faCogs, faUserCheck, faUserGraduate, faXmark } from "@fortawesome/free-solid-svg-icons"

const ResultPage = ({ }) => {

    const { status: studentStatus } = useSelector(state => state.student)

    const loc = useLocation()
    const exam = loc?.state.exam;
    const studentId = loc?.state.studentId;
    const markSecured = loc?.state.markSecured

    const navigate = useNavigate()

    const [student, setStudent] = useState(null)

    useEffect(() => {
        let temp = exam?.studentList.find(std => std.studentId === studentId)
        if (temp) setStudent(temp)
    }, [studentId, exam])


    return (
        <section className="exam-attending-page">
            <div className="exam-details-card">
                <div className="exam-detail-item">
                    <FontAwesomeIcon className="icon" icon={faUserGraduate} />
                    <div>
                        <p className="detail-title">Student Id</p>
                        <p className="detail-value">{studentId}</p>
                    </div>
                </div>
                <div className="exam-detail-item">
                    <FontAwesomeIcon className="icon" icon={faCalendar} />
                    <div>
                        <p className="detail-title">Semester</p>
                        <p className="detail-value">{exam?.semester}</p>
                    </div>
                </div>
                <div className="exam-detail-item">
                    <FontAwesomeIcon className="icon" icon={faBook} />
                    <div>
                        <p className="detail-title">Subject</p>
                        <p className="detail-value">{exam?.paperName}</p>
                    </div>
                </div>
                <div className="exam-detail-item">
                    <FontAwesomeIcon className="icon" icon={faCogs} />
                    <div>
                        <p className="detail-title">Mark Secured</p>
                        <p className="detail-value">{markSecured} out of {exam?.fullMark}</p>
                    </div>
                </div>
                <div className="exam-detail-item">
                    <FontAwesomeIcon className="icon" icon={faUserCheck} />
                    <div>
                        <p className="detail-title">Status</p>
                        <p className="detail-value">
                            {
                                studentStatus === statusCode.IDLE
                                    ? student ? "Attended" : "Not Attended"
                                    : "Attended"
                            }
                        </p>
                    </div>
                </div>
                <div className="exam-detail-item">
                    <FontAwesomeIcon className="icon" icon={faClock} />
                    <div>
                        <p className="detail-title">Duration</p>
                        <p className="detail-value">{Math.floor(exam?.duration / 60)} hour {exam?.duration % 60} minutes</p>
                    </div>
                </div>
            </div>
            <div className="question">
                {
                    exam?.questionsAndAnswers.map((question, index) => (
                        <div key={question.options[1] + index} className="question-item">
                            <div className="question-header">
                                <span className="question-index">{index + 1}</span>
                                <p className="question-text">{question.question}</p>
                            </div>
                            <div className="options">
                                {
                                    question.options.map((option, i) => (
                                        <div className="option-item" key={option + i} style={{ backgroundColor: option === question.answer && "rgb(65 230 65 / 45%)" }}>
                                            <input className="option-input" type="radio" name={`option${index}`} disabled defaultChecked={option === question.answer} />
                                            <p className="option-text">{option}</p>
                                        </div>
                                    ))
                                }
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <p>{studentStatus === statusCode.IDLE ? "Your" : "Student"} Answer : {student ? student.answers[index] : "N/A"}</p>
                            </div>
                        </div>
                    ))
                }
                <div className="btn-container">
                    <button className="submit-btn" onClick={() => navigate(-1)} >Go Back</button>
                </div>
            </div>
        </section>
    )
}

export default ResultPage