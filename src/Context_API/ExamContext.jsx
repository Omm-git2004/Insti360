import axios from 'axios';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLoadingContext } from './LoadingContext';

// Create the ExamContext
const ExamContext = createContext();

// Create a custom hook to use the ExamContext
export const useExamContext = () => useContext(ExamContext);

export const ExamProvider = ({ children, exam, studentData }) => {


    const { setIsloading } = useLoadingContext()

    const [answerInfo, setAnswerInfo] = useState(Array(exam?.questionsAndAnswers.length).fill(""));
    const [canSubmit, setCanSubmit] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [showMessage, setShowMessage] = useState("");

    const answerRef = useRef(answerInfo)

    useEffect(() => {
        answerRef.current = answerInfo
    }, [answerInfo])

    const handleSubmit = () => {
        setShowDialog(false);
        setCanSubmit(false);
        setIsloading(true)

        let mark = 0;
        exam.questionsAndAnswers.forEach((question, index) => {
            mark = question.answer === answerRef.current[index] ? mark + 1 : mark;
        });

        mark *= (exam.fullMark / answerRef.current.length);
        console.log(studentData);

        axios.post(`student/attendExam/${exam._id}`, { studentId: studentData.studentId, mark, answers: answerRef.current })
            .then(res => {
                const { status, message } = res.data;
                setShowMessage(
                    <>
                        <p>{message}</p>
                        {status && <p>Mark Secured: {mark} out of {exam.fullMark}</p>}
                        <p>Safe to leave this page!!!</p>
                    </>
                );
                setIsloading(false)
            })
            .catch(err => {
                console.error(`Attending Exam --> ${err}`);
                setShowMessage("Network connection error");
                setIsloading(false)
            });
    };

    const handleAnswer = (index, val) => {
        let temp = [...answerInfo];
        temp[index] = val;
        setAnswerInfo(temp);
    };

    return (
        <ExamContext.Provider value={{
            answerInfo,
            canSubmit,
            showDialog,
            showMessage,
            handleSubmit,
            handleAnswer,
            setShowDialog
        }}>
            {children}
        </ExamContext.Provider>
    );
};
