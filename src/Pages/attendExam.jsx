import { useLocation, useParams } from "react-router-dom";
import ExamPaper from "../Components/Student/ExamPaper";

const AttendExam = () => {
    const params = useParams()
    const loc = useLocation()

    const examInfo = loc?.state;

    return (
        examInfo
            ? <ExamPaper exam={examInfo} />
            : <p>Something went wrong</p>
    )
}

export default AttendExam;