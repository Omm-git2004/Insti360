import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import QuestionPapers from "./QuestionPapers";
import ShowTiming from "./ShowTiming";
import { ExamProvider, useExamContext } from "../../Context_API/ExamContext";
import PopWindow from "../Others/PopWindow";

const ExamContent = ({ exam }) => {

    const { data: studentData } = useSelector(state => state.student)
    const { data: departmentData } = useSelector(state => state.department)
    const { data: batchData } = useSelector(state => state.batch)

    const { handleSubmit, showMessage, showDialog, canSubmit, setShowDialog } = useExamContext()

    const navigate = useNavigate()

    const [confirm, setConfirm] = useState(false) // to check whether the student has accepted the student information
    const [canStartExam, setCanStartExam] = useState(false) // to check whether the exam starting time has met or not


    return (
        <section>
            {
                confirm
                    ? canStartExam
                        ? canSubmit
                            ? <QuestionPapers exam={exam} semester={batchData.semester} />
                            : showMessage !== "" && <div className="student-info">
                                {showMessage}
                                <button className="confirm-btn" onClick={() => navigate(-1)} >Done</button>
                            </div>
                        : <ShowTiming startingTime={exam.encodedTime} setCanStartExam={() => setCanStartExam(true)} />
                    : <div className="student-info">
                        <p>Student Name : {studentData.studentName.firstName} {studentData.studentName.lastName}</p>
                        <p>Student Id : {studentData.studentId}</p>
                        <p>Department : {departmentData.departmentName}</p>
                        <p>Batch : {studentData.studentDeptInfo.batchName}</p>
                        <button className="confirm-btn" onClick={() => setConfirm(true)} >Confirm</button>
                    </div>
            }
            {
                showDialog && <PopWindow
                    onClose={() => setShowDialog(false)}
                    onProceed={() => handleSubmit()}
                    userType={"submitExam"}
                />
            }
        </section>
    )
}


export default ({ exam }) => {
    const { data: studentData } = useSelector(state => state.student);

    return (
        <ExamProvider exam={exam} studentData={studentData}>
            <ExamContent exam={exam} />
        </ExamProvider>
    );
}