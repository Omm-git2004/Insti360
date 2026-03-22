import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default ({ exams, date, currentTime }) => {

    const navigate = useNavigate()

    const { data: studentData } = useSelector(state => state.student)

    return (
        <div className="studentExam-container">
            {
                exams.length > 0
                    ? <table>
                        <thead>
                            <tr>
                                <th>Sl No</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Duration</th>
                                <th>Full Mark</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                exams.map((exam, index) => (
                                    <tr key={exam._id} >
                                        <td>{index + 1}</td>
                                        <td>{exam.date}</td>
                                        <td>{exam.time}</td>
                                        <td>
                                            {Math.floor(exam.duration / 60)} hour {exam.duration % 60} minutes
                                        </td>
                                        <td>{exam.fullMark}</td>
                                        <td>
                                            {
                                                exam.examTimeOver
                                                    ? <button
                                                        onClick={
                                                            () => navigate(`/student/${studentData.studentId}/resultPaper/${exam._id}`,
                                                                { state: { exam, studentId: studentData.studentId } })
                                                        }
                                                    >Result</button>
                                                    : date === exam.date && (currentTime >= exam.encodedTime - 10 && currentTime < exam.encodedTime)
                                                        ? <button onClick={() => navigate(`/student/${studentData.studentId}/attendExam/${exam._id}`, { state: exam })} style={{ backgroundColor: "green" }} >Attend</button>
                                                        : <button style={{ backgroundColor: "red" }} >Attend</button>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    : <p>Exam list is empty</p>
            }
        </div>
    )
}