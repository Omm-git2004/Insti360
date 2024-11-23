import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useLoadingContext } from "../Context_API/LoadingContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose, faGear, faRobot, faSpinner } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "../Components/Others/PopWindow"
import FormPopUp from "../Components/Others/FormPopUp"

const CreateExamPage = () => {

    const navigate = useNavigate()
    const loc = useLocation()
    const examInfo = loc?.state; // the examInfo can have deptId, subject, examData

    const { data: admin } = useSelector(state => state.admin)

    const { isloading, setIsloading } = useLoadingContext()

    const [showQuestionPaper, setShowQuestionPaper] = useState(admin !== null)
    const [canUpdate, setCanUpdate] = useState(false);

    const [mark, setMark] = useState("")
    const [totalNumberOfQuestion, setTotalNumberOfQuestion] = useState(0) // to be used while generating question using ai

    const [canGenerateUsingAI, setCanGenerateUsingAI] = useState(false)


    let [questions, setQuestions] = useState([
        {
            question: "",
            answer: null,
            options: ["", "", "", ""],
            actualIndex: 0
        }
    ])

    useEffect(() => {
        if (examInfo.examData) {

            if (examInfo.examData.adminRecog) setShowQuestionPaper(true)

            let temp = []
            examInfo.examData.questionsAndAnswers.map((e, index) => {
                temp.push(
                    {
                        question: e.question,
                        answer: e.answer,
                        options: e.options,
                        actualIndex: index
                    }
                )
            })
            setCanUpdate(true)
            setQuestions(temp)
            setMark(examInfo.examData.fullMark / temp.length)
        }
    }, [examInfo])

    const addMore = () => {
        const obj = {
            question: "",
            answer: null,
            options: ["", "", "", ""],
            actualIndex: questions[questions.length - 1].actualIndex + 1
        }
        setQuestions([...questions, obj])
    }

    const remove = (index) => {
        if (questions.length === 1) return toast("Question paper can't be empty!!!")
        let temp = [...questions];
        temp = temp.filter(t => t.actualIndex !== index)
        setQuestions(temp)
    }

    const handleQuestion = (index, value) => {
        let temp = [...questions]
        temp.forEach(t => {
            if (t.actualIndex === index) t.question = value.trim()
        })
        setQuestions(temp)
    }

    const handleOptions = (index, optionIndex, value) => {
        let temp = [...questions]
        temp.forEach(t => {
            if (t.actualIndex === index) t.options[optionIndex] = value.trim()
        })
    }

    const handleAnswer = (actualIndex, option_index) => {
        let temp = [...questions]
        let obj = temp.filter(t => t.actualIndex === actualIndex)

        if (!obj[0].options[option_index]) return toast("Answer can't be empty")

        temp.forEach(t => {
            if (t.actualIndex === actualIndex) t.answer = obj[0].options[option_index].trim()
        })

        setQuestions(temp)
    }

    const checkValidity = (arr) => {
        questions = arr.length === 0 ? questions : arr;

        const index = questions.findIndex(q => q.answer === null || q.question === "" || !q.options.every(op => op !== ""))

        if (index > -1) return toast(`Invalid Question ${index + 1}`)

        if (mark * questions.length <= 0) return toast("Invalid Mark")

        setShowQuestionPaper(true);
    }

    const handlePost = () => {
        setIsloading(true)
        axios.post(`faculty/creatQuestionPaper/${examInfo.deptId}`, { paperName: examInfo.subject, fullMark: mark * questions.length, questionPaperInfo: questions })
            .then(res => {
                const { status, message } = res.data;
                toast(message)
                if (status) navigate(-1)
            })
            .catch(err => {
                console.error(err)
                if (err.response.status === 404) return toast(err.response.data.message)
                toast("Network connection error")
            })
            .finally(() => setIsloading(false))
    }

    const handleUpdation = () => {
        if (examInfo.examData.adminRecog) return
        setIsloading(true)
        axios.put(`faculty/modifyQuestionPaper/${examInfo.examData._id}`, { fullMark: mark * questions.length, questionAndAnswers: questions })
            .then(res => {
                const { status, message } = res.data;
                toast(message)
                if (status) navigate(-1)
            })
            .catch(err => {
                console.error(`Modifing question paper --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => setIsloading(false))
    }

    const generateUsingAI = (e) => {
        e.preventDefault()

        if (isNaN(parseInt(totalNumberOfQuestion)) || totalNumberOfQuestion <= 0) return toast("Please enter the number of questions you wanted to generate.")
        setIsloading(true)
        const encodedPaperName = encodeURIComponent(examInfo.subject); // As the papername may contain special character and passing a string ending with a special character to url might cause problem.

        axios.get(`faculty/generateUsingAI/?numberOfQuestions=${totalNumberOfQuestion}&paperName=${encodedPaperName}`)
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message)

                const tempArr = questions.length === 1 && questions[0].question === "" ? [] : questions
                let index = tempArr.length === 0 ? 0 : questions[questions.length - 1].actualIndex + 1;

                message.forEach(msg => {
                    tempArr.push({
                        question: msg.question,
                        answer: msg.answer,
                        options: msg.options,
                        actualIndex: index++
                    })
                })

                setQuestions(tempArr)

                checkValidity(tempArr)
            })
            .catch(err => {
                console.error(`Error generating questions using ai --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => {
                setIsloading(false)
                setCanGenerateUsingAI(false)
                setTotalNumberOfQuestion(0)
            })
    }

    const formElems = [
        { type: "text", defaultValue: examInfo.subject, label: "Paper Name", disabled: true, name: "papername" },
        { type: "number", name: "totalNumberOfQuestion", label: "Number Of Questions", onChange: (e) => setTotalNumberOfQuestion(e.target.value), }
    ]

    return (
        examInfo
            ? <section className="section-container">
                <h2>Create Exam</h2>

                <div className="input-group">
                    <span>Subject : </span>
                    <input type="text" value={examInfo.subject} disabled />
                </div>
                <div className="input-group">
                    <span>{showQuestionPaper ? "Total Mark" : "Each Question"} : </span>
                    {
                        showQuestionPaper
                            ? <input type="number" value={mark * questions.length} disabled key={"totalMark"} />
                            : <input type="number" placeholder="mark of each question" key={"mark"} onChange={(e) => setMark(e.target.value)} defaultValue={mark} disabled={showQuestionPaper} />
                    }
                </div>
                {
                    questions.length > 0 && questions.map((question, index) => (
                        <div key={question.actualIndex} className="question-container">
                            <p>
                                <span>{index + 1}</span>
                                <textarea
                                    type="text"
                                    defaultValue={question.question}
                                    placeholder={`Enter Question ${index + 1}`}
                                    onChange={(e) => handleQuestion(question.actualIndex, e.target.value)} disabled={showQuestionPaper}
                                />
                            </p>

                            {
                                question.options.map((val, i) => (
                                    <div key={`option${question.actualIndex}_${i}`} className="option-container">
                                        {
                                            showQuestionPaper
                                                ? <input type="radio"
                                                    name={`option${index}`}
                                                    key={`question${index}option${i}`}
                                                    id={`question${index}option${i}`}
                                                    checked={question.answer === val} disabled
                                                />
                                                : <input type="radio"
                                                    name={`option${index}`}
                                                    key={`question${index}option${i}`}
                                                    id={`question${index}option${i}`}
                                                    onChange={() => handleAnswer(question.actualIndex, i)}
                                                    checked={question.answer === val}
                                                />
                                        }
                                        <input type="text" placeholder={`Option${i + 1}`}
                                            defaultValue={val}
                                            onChange={(e) => handleOptions(question.actualIndex, i, e.target.value)}
                                            disabled={showQuestionPaper}
                                        />
                                    </div>
                                ))
                            }

                            {!showQuestionPaper && <button onClick={() => remove(question.actualIndex)} className="button-secondary cancel-btn">Delete</button>}
                        </div>
                    ))
                }
                {
                    admin || examInfo.examData?.adminRecog
                        ? <button onClick={() => navigate(-1)} className="button-secondary violet-btn">Go Back</button>
                        : showQuestionPaper
                            ? <>
                                {
                                    isloading
                                        ? <button disabled className="button-secondary save-btn" >
                                            <FontAwesomeIcon icon={faSpinner} spin /> Proceeding...
                                        </button>
                                        : <button onClick={canUpdate ? handleUpdation : handlePost} className="button-secondary save-btn">Proceed</button>
                                }
                                <button onClick={() => {
                                    setShowQuestionPaper(false);
                                }} disabled={isloading} className="button-secondary cancel-btn" style={{ marginLeft: "10px" }}>Cancel</button>
                            </>
                            : <div className="button-container">
                                <button onClick={addMore}>Add More</button>
                                <button onClick={() => checkValidity([])}>{canUpdate ? "Update" : "Post"}</button>
                                <button onClick={() => setCanGenerateUsingAI(true)} >Generate Using AI</button>
                                <button onClick={() => navigate(-1)} >Go Back</button>
                            </div>
                }
                {
                    canGenerateUsingAI && <FormPopUp onClose={() => setCanGenerateUsingAI(false)} onSubmit={generateUsingAI} formElems={formElems} />
                }
            </section>
            : <p>Something went wrong!!!</p>
    )
}

export default CreateExamPage;