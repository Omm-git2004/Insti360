import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify"

const PunchOut = () => {
    const { data: departmentData } = useSelector(state => state.department)
    const [rfidTag, setRfidTag] = useState("");
    const [punchedStudent, setPunchedStudent] = useState(null);

    const punchOutNow = () => {
        if (!rfidTag.trim()) return alert("Scan RFID First!")

        axios.post("punchId/punchOut", { departmentId: departmentData._id, RFIDTagId: rfidTag })
            .then(res => {
                const { status, message } = res.data;

                if (!status) {
                    toast(message)
                    return;
                } else {
                    setPunchedStudent(message)
                    setTimeout(() => {
                        setPunchedStudent(null);
                    }, 2000);
                }

            })
            .catch(err => {
                console.error(`Error at PunchOut --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => setRfidTag(""))

    }

    return (
        departmentData
            ? <div className="scan-page" onClick={() => document.getElementById("rfidHiddenInput")?.focus()}>

                {/* ✅ Hidden input (student won't see it) */}
                <input
                    id="rfidHiddenInput"
                    type="text"
                    value={rfidTag}
                    onChange={(e) => setRfidTag(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") punchOutNow();  // ✅ punchIn or punchOut
                    }}
                    autoFocus
                    className="hidden-scan-input"
                />

                {/* ✅ Show scanning screen only when not punched */}
                {!punchedStudent ? (
                    <div className="scan-card">
                        <h2 className="scan-title">📡 Scanning Card...</h2>
                        <p className="scan-subtitle">Please tap your RFID card</p>

                        <div className="scanner-circle">
                            <div className="scanner-pulse"></div>
                            <div className="scanner-dot"></div>
                        </div>

                        <p className="scan-hint">⏳ Waiting for RFID...</p>
                        <p className="scan-click">Tap to Punch Out</p>
                    </div>
                ) : (
                    <div className="scan-card success-card">
                        <h2 className="success-title">✅ Punch Out Successful</h2>
                        <h3 className="success-name">
                            Goodbye, {punchedStudent.studentName} 🎉
                        </h3>

                        <p className="success-text">ID: {punchedStudent?.studentId}</p>
                        <p className="success-text">
                            Exit Time: {punchedStudent?.entryTime}
                        </p>

                        <p className="next-msg">Ready for next student...</p>
                    </div>
                )}
            </div>
            : <p>Something went wrong</p>
    )
}

export default PunchOut;