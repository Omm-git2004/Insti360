import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faDownload, faMousePointer, faSpinner, faTrashCan, faUpload } from "@fortawesome/free-solid-svg-icons";
import PopWindow from "./Others/PopWindow";

export default ({ assignmentInfo, deptId, type, setAssignment, onRemove, isVisiting, getAssignments }) => {

    const { data: studentData } = useSelector(state => state.student)
    const { data: instituteData } = useSelector(state => state.institute)

    const { isloading, setIsloading, isUploading, setIsUploading, isDownloading, setIsDownloading, isRemoving, setIsRemoving } = useLoadingContext()

    const [pdf, setPdf] = useState(null);

    const [canSubmitAssignment, setCanSubmitAssignment] = useState(false)

    const [canRemoveAssignment, setCanRemoveAssignment] = useState(false) // when student or teacher wants to remove the assignment

    const [readMore, setReadMore] = useState(false)

    let intervalRef = useRef(null);

    const startInterval = () => {
        intervalRef.current = setInterval(() => {
            let temp = new Date().toString().split(" ")[4].split(":")
            if (parseInt(temp[0] * 60 + parseInt(temp[1])) <= assignmentInfo.encodedTime) setCanSubmitAssignment(true)
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

    useEffect(() => {
        //  if the current date is before the submission date then no need to check the time

        let date_obj = new Date().toISOString().slice(0, 10).toString()
        let currentYear = date_obj.split("-")[0]
        let currentMonth = date_obj.split("-")[1]
        let currentDate = date_obj.split("-")[2]

        let submissionYear = assignmentInfo.submissionDate.split("-")[0]
        let submissionMonth = assignmentInfo.submissionDate.split("-")[1]
        let submissionDate = assignmentInfo.submissionDate.split("-")[2]

        let isYearEqual = (currentYear == submissionYear)
        let isMonthEqual = (currentMonth == submissionMonth)
        let isDateEqual = (currentDate == submissionDate) // check whether the current date is same as the submission date
        let isDateLess = (currentDate < submissionDate) // check whether the current date is before the submission date


        if (isYearEqual && isMonthEqual && isDateLess) setCanSubmitAssignment(true)
        else if (isYearEqual && isMonthEqual && isDateEqual) startInterval()
        else setCanSubmitAssignment(false)

    }, [])

    const handleFileChange = (e) => {
        setPdf(e.target.files[0]);
    };

    // To remove any assignment. Can only be called by admin or teacher of that subject
    const removeAssignment_admin_teacher = () => {
        setIsRemoving(true)
        axios.delete(`${type}/handleAssignment/${assignmentInfo._id}/?departmentId=${deptId}&subject=${assignmentInfo.subject}`)
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    setAssignment(null)
                    onRemove(assignmentInfo._id)
                }
                toast(message)
            })
            .catch(err => {
                console.error(`Removing assignment --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => {
                setIsRemoving(false)
                setCanRemoveAssignment(false)
            })
    }

    // This method will be called when the student removes the assignment
    const removeAssignment_student = () => {
        setIsloading(true)

        axios.delete(`student/handleAssignment/${assignmentInfo._id}/?studentId=${studentData.studentId}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message)
                if (status) {
                    setAssignment(null)
                    getAssignments()
                }
            })
            .catch(err => {
                console.error(`Removing Assignment from student side --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => {
                setIsloading(false)
                setCanRemoveAssignment(false)
            })
    }


    // To call the API to push the student data to the assignment_student_list in the database
    const handleAssignmentSubmit = (pdfURLs) => {
        setIsloading(true)
        axios.post(`student/handleAssignment/${assignmentInfo._id}`, { studentName: studentData.studentName, studentId: studentData.studentId, pdf: pdfURLs, pdfLink: pdfURLs.length > 0 ? "" : pdf })
            .then(res => {
                const { status, message } = res.data;
                toast(message)
                setIsloading(false)

                if (status) {
                    setPdf(null)
                    setAssignment(null)
                    getAssignments()
                }
            })
            .catch(err => {
                setIsloading(false)
                console.error(`Submitting Assignment error --> ${err}`)
                toast("Network connection error")
            })
    }

    // To upload the pdf of the assignment if the institute has premium access
    const handlePDFSubmit = (e) => {
        e.preventDefault();

        if (!pdf) return toast('Please select a PDF file to upload');

        setIsUploading(true)

        const formData = new FormData();
        formData.append('pdf', pdf);


        axios.post("uploadPDF", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(res => {
                const { status, message } = res.data;
                setPdf("")
                setIsUploading(false)
                if (!status) return toast(message)

                // On successfull pdf submission call the method to push the student data into the database
                handleAssignmentSubmit(message)
            })
            .catch(err => {
                console.error(`Error uploading pdf --> ${err}`)
                toast("Network connection error")
                setIsUploading(false)
            })
    };

    const downloadPDF = (studentId, pdf) => {
        setIsDownloading(true)
        axios.post(`downloadPDF/?studentId=${studentId}&subject=${assignmentInfo.subject}&assignmentId=${assignmentInfo._id}`,
            { pdf },
            { responseType: "blob" }
        )
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${assignmentInfo.subject}_${studentId}_${assignmentInfo._id}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast("Download successful");
            })
            .catch(err => {
                console.error(`Error : Downloading pdf --> ${err}`)
                toast(err.response?.data || "Error downloading file")
            })
            .finally(() => setIsDownloading(false))
    }

    const divElems = [
        { key: "Teacher Name", value: `${assignmentInfo?.teacherName.firstName} ${assignmentInfo?.teacherName.lastName}` },
        { key: "Date", value: assignmentInfo?.date },
        { key: "Time", value: assignmentInfo?.time },
        { key: "Submission Date", value: assignmentInfo?.submissionDate },
        { key: "Submission Time", value: assignmentInfo?.submissionTime },
    ]

    return (
        <div className="assignment-container">
            {canRemoveAssignment && <PopWindow userType={"Assignment"} onClose={() => setCanRemoveAssignment(false)} onProceed={() => studentData ? removeAssignment_student() : removeAssignment_admin_teacher()} />}
            <div className="header">
                <h2>Assignment Information</h2>
            </div>
            <div className="btn-container">
                <button onClick={() => setAssignment(null)} disabled={isloading || isDownloading || isUploading} className="close-btn">
                    <FontAwesomeIcon icon={faClose} />
                </button>
                {!isVisiting && <button onClick={() => setCanRemoveAssignment(true)} disabled={isloading || isDownloading || isUploading || isRemoving} className="remove-btn" >
                    <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} /> Remove
                </button>}
            </div>
            <div className="assignment-info">
                {
                    divElems.map(({ key, value }) => (
                        <div key={key}>
                            <p>{key}</p>
                            <p> {value} </p>
                        </div>
                    ))
                }
            </div>
            <div className="assignment-question">
                <p><span>Assignment :</span> <span>
                    {
                        readMore
                            ? <>
                                {assignmentInfo.assignment} <span style={{ color: "blue", cursor:"pointer" }} onClick={() => setReadMore(false)} >SHOW LESS</span>
                            </>
                            : <>
                                {assignmentInfo.assignment.substr(0, 200)}...<span style={{ color: "blue", cursor:"pointer" }} onClick={() => setReadMore(true)} >SHOW MORE</span>
                            </>
                    }
                </span></p>
            </div>
            <div className="studentInfo-container">
                {
                    studentData
                        ? assignmentInfo?.studentList.some(std => std.studentId === studentData.studentId)
                            ? <div>
                                <button onClick={() => setCanRemoveAssignment(true)} disabled={isloading || isDownloading || isUploading || isRemoving} className="remove-btn" >
                                    <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} />
                                    {isRemoving ? " Removing" : " Remove"}
                                </button>
                                {
                                    !instituteData.premiumInfo.isPremium
                                        ? <button
                                            onClick={() => { downloadPDF(studentData.studentId, assignmentInfo.studentList.find(std => std.studentId === studentData.studentId).pdf) }} // pass student id and find the pdfs of the student
                                            disabled={isloading || isDownloading || isUploading || isRemoving}
                                            className="remove-btn"
                                            style={{ backgroundColor: "blue" }}
                                        >
                                            <FontAwesomeIcon icon={isDownloading ? faSpinner : faDownload} spin={isDownloading} />
                                            {isDownloading ? " Downloading" : " Download"}
                                        </button>
                                        : <button
                                            onClick={() => window.open(assignmentInfo.studentList.find(std => std.studentId === studentData.studentId).pdfLink, "_blank")}
                                            disabled={isloading || isDownloading || isUploading || isRemoving}
                                            className="remove-btn"
                                            style={{ backgroundColor: "blue" }}
                                        >
                                            <FontAwesomeIcon icon={faMousePointer} /> Visit
                                        </button>
                                }
                            </div>
                            : canSubmitAssignment
                                //*There should be two option if the institute has a premium access then the student can upload pdf else the pdf link will be uploaded*/
                                ? <div>
                                    <input
                                        type={!instituteData.premiumInfo.isPremium ? "file" : "url"}
                                        accept={!instituteData.premiumInfo.isPremium ? "application/pdf" : ""}
                                        onChange={(e) => !instituteData.premiumInfo.isPremium ? handleFileChange(e) : setPdf(e.target.value)}
                                    />
                                    <button
                                        disabled={isloading || isDownloading || isUploading}
                                        onClick={(e) => !instituteData.premiumInfo.isPremium ? handlePDFSubmit(e) : handleAssignmentSubmit([])}
                                        className="blue-btn"
                                    >
                                        <FontAwesomeIcon icon={isUploading ? faSpinner : faUpload} spin={isUploading} /> {isUploading || isloading ? "Uploading" : "Upload"}
                                    </button>
                                </div>
                                : <p>Time Over</p>

                        : assignmentInfo?.studentList.length > 0
                            ? <>
                                <div className="header">
                                    <h2>Student Table</h2>
                                </div>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>SL NO.</th>
                                            <th>Student Name</th>
                                            <th>Student Id</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>PDF</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            assignmentInfo.studentList.map(({ studentName, studentId, date, time, pdf, pdfLink }, index) => (
                                                <tr key={studentId}>
                                                    <td>{index + 1}</td>
                                                    <td>{studentName.firstName} {studentName.lastName}</td>
                                                    <td>{studentId}</td>
                                                    <td>{date}</td>
                                                    <td>{time}</td>
                                                    {
                                                        /* Check whether student has upload the pdf or has share the pdf link */
                                                    }
                                                    <td>
                                                        {
                                                            pdf.length > 0
                                                                ? <button onClick={() => downloadPDF(studentId, pdf)} className="blue-btn" disabled={isloading || isDownloading || isUploading} >{isDownloading ? "Downloading..." : "Download"}</button>
                                                                : <button onClick={() => window.open(pdfLink, "_blank")} >View</button>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </>
                            : <p>Student List is empty</p>
                }
            </div>
        </div >
    )
}