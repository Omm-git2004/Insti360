import ExamTimer from "./ExamTimer"
import { useExamContext } from "../../Context_API/ExamContext"
import { useLoadingContext } from "../../Context_API/LoadingContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faBook, faCogs, faClock } from "@fortawesome/free-solid-svg-icons";

export default ({ exam, semester }) => {

    const { handleAnswer, setShowDialog, showDialog, canSubmit } = useExamContext()
    const { isloading } = useLoadingContext()

    return (
        <section className="exam-attending-page">
            <div className="exam-details-card">
                <div className="exam-detail-item">
                    <FontAwesomeIcon className="icon" icon={faCalendar} />
                    <div>
                        <p className="detail-title">Semester</p>
                        <p className="detail-value">{semester}</p>
                    </div>
                </div>
                <div className="exam-detail-item">
                    <FontAwesomeIcon className="icon" icon={faBook} />
                    <div>
                        <p className="detail-title">Subject</p>
                        <p className="detail-value">{exam.paperName}</p>
                    </div>
                </div>
                <div className="exam-detail-item">
                    <FontAwesomeIcon className="icon" icon={faCogs} />
                    <div>
                        <p className="detail-title">Full Mark</p>
                        <p className="detail-value">{exam.fullMark}</p>
                    </div>
                </div>
                <div className="exam-detail-item">
                    <FontAwesomeIcon className="icon" icon={faClock} />
                    <div>
                        <p className="detail-title">Duration</p>
                        <p className="detail-value">{Math.floor(exam.duration / 60)} hour {exam.duration % 60} minutes</p>
                    </div>
                </div>
                <div className="exam-timer">
                    <p className="detail-title">Time Remaining</p>
                    <ExamTimer className="detail-value" duration={exam.duration} autoSubmit={() => handleSubmit()} />
                </div>
            </div>
            <div className="question">
                {
                    exam.questionsAndAnswers.map((question, index) => (
                        <div key={question.options[1] + index} className="question-item">
                            <div className="question-header">
                                <span className="question-index">{index + 1}</span>
                                <p className="question-text">{question.question}</p>
                            </div>
                            <div className="options">
                                {
                                    question.options.map((option, i) => (
                                        <div key={i} className="option-item" >
                                            <input
                                                type="radio"
                                                name={`option${index}`}
                                                onChange={() => handleAnswer(index, option)}
                                                disabled={!canSubmit}
                                                className="option-input"
                                            />
                                            <p className="option-text">{option}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
                <div className="btn-container">
                    {
                        isloading
                            ? <button className="submit-btn" disabled >Submitting...</button>
                            : <button className="submit-btn" onClick={() => setShowDialog(true)} disabled={showDialog || !canSubmit}>Submit</button>
                    }
                </div>
            </div>
        </section>
    )
}