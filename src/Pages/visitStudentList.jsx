import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom"

const VisitStudentList = () => {

    const loc = useLocation()
    const navigate = useNavigate()

    const exam = loc?.state;

    return (
        <section className="visit-student-list">
            <div className="btn-container">
                <button onClick={() => navigate(-1)} className="back-button" >
                    <FontAwesomeIcon icon={faArrowLeftLong} />
                </button>
            </div>
            {
                exam
                    ? <div className="exam-details">
                        <h2 className="exam-title">Exam Details</h2>
                        <div className="exam-info">
                            <p><span>Subject:</span> {exam.paperName}</p>
                            <p><span>Full Mark:</span> {exam.fullMark} </p>
                            <p><span>Exam Date:</span> {exam.date} </p>
                            <p><span>Exam Time:</span> {exam.time} </p>
                            <p><span>Duration: </span> {Math.floor(exam.duration / 60)}hour and {exam.duration % 60}minutes</p>
                        </div>
                        {
                            exam.studentList.length > 0
                                ? <table>
                                    <thead>
                                        <tr>
                                            <th>Sl.No.</th>
                                            <th>Student Id</th>
                                            <th>Mark Secured</th>
                                            <th>Answer Paper</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            exam.studentList.map((student, index) => (
                                                <tr key={student.studentId} >
                                                    <td>{index + 1}</td>
                                                    <td>{student.studentId}</td>
                                                    <td>{student.mark}</td>
                                                    <td>
                                                        <button
                                                            onClick={
                                                                () => navigate(`/student/${student.studentId}/resultPaper/${exam._id}`,
                                                                    { state: { exam: exam, studentId: student.studentId, markSecured: student.mark } })
                                                            }
                                                        >
                                                            Check
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                : <p>Student List Empty</p>
                        }
                    </div>
                    : <p>Something went wrong</p>
            }
        </section>
    )
}

export default VisitStudentList;