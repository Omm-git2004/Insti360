import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addStudentInfos } from "../Redux_Components/Features/batchSlice.mjs";

export default ({ studentList, batchName }) => {

    const dispatch = useDispatch();

    const { studentData: studentInfos } = useSelector(state => state.batch)


    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

    // ✅ Get correct number of days in selected month/year
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();


    useEffect(() => {
        axios.post(`admin/getStudentInfos`, { studentList })
            .then(res => {
                const { status, message } = res.data;
                if (status) dispatch(addStudentInfos(message))
            })
            .catch(err => {
                console.error(`Retrieving Student Information --> ${err}`)
                toast("Network connection error")
            })
    }, [])

    return (
        <section>
            {
                studentInfos.length > 0
                    ? <div className="attendance-wrapper">
                        <div className="attendance-header">
                            <h2 className="title">📌 Attendance Sheet (30 Days)</h2>

                            {/* Month + Year Selector */}
                            <div className="selector-box">
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    className="selector"
                                >
                                    {months.map((m, idx) => (
                                        <option key={idx} value={idx}>
                                            {m}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="selector"
                                >
                                    {years.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="table-container">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th className="sticky-col sticky-col-1">Student ID</th>
                                        <th className="sticky-col sticky-col-2">Student Name</th>
                                        {/* dynamic days */}
                                        {Array.from({ length: daysInMonth }, (_, i) => (
                                            <th key={i + 1}>{i + 1}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        studentInfos.map(({ _id, studentId, studentName, studentActivity }, index) => (
                                            <tr key={_id}>
                                                <td className="sticky-col sticky-col-1">{studentId}</td>

                                                <td className="sticky-col sticky-col-2">
                                                    {studentName.firstName} {studentName.lastName}
                                                </td>

                                                {/* ✅ dynamic days cells */}
                                                {Array.from({ length: daysInMonth }, (_, i) => {
                                                    const day = i + 1;

                                                    // ✅ match record for selected month + year + day
                                                    const record = studentActivity?.find((a) => {
                                                        if (!a?.currentDate) return false;

                                                        // Example: "22 Jan 2026"
                                                        const parts = a.currentDate.split(" "); // ["22", "Jan", "2026"]
                                                        const recordDay = Number(parts[0]);
                                                        const recordMonth = parts[1];
                                                        const recordYear = Number(parts[2]);

                                                        return (
                                                            recordDay === day &&
                                                            recordMonth === months[selectedMonth] &&
                                                            recordYear === selectedYear
                                                        );
                                                    });

                                                    const inTime = record?.entryTime || "NA";
                                                    const outTime = record?.exitTime || "NA";

                                                    return (
                                                        <td key={day}>
                                                            <div className="time-box">
                                                                <div className="in-time">IN: {inTime}</div>
                                                                <div className="out-time">OUT: {outTime}</div>
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    : <p>Student list is empty</p>
            }
        </section>
    )
}