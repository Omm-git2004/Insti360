import { createSlice } from "@reduxjs/toolkit";
import { statusCode } from "../../utils/statusFile.mjs";

const initialState = {
    data: null,
    status: statusCode.EMPTY,
    studentData: []
}

const batchSlice = createSlice({
    name: "batch",
    initialState,
    reducers: {
        addBatch: (state, action) => {
            state.data = action.payload;
            state.status = statusCode.IDLE
        },
        modifyBatch: (state, action) => {
            state.data.batchName = action.payload.newBatchName;
            state.data.semester = action.payload.newSemester
        },
        removeBatch: (state, action) => {
            state.data = null;
            state.studentData = [];
            state.status = statusCode.EMPTY
        },
        updateSemester: (state, action) => {
            state.data = action.payload;
        },
        addAnnouncement_batch: (state, action) => {
            state.data.batchAnnouncements.push(action.payload)
        },
        removeAnnouncement_batch: (state, action) => {
            state.data.batchAnnouncements = state.data.batchAnnouncements.filter(ann => ann._id !== action.payload)
        },
        addStudentInfos: (state, action) => {
            state.studentData = action.payload;
        },
        removeStudentInfo_batch: (state, action) => {
            state.data.studentList = state.data.studentList.filter(s => s._id !== action.payload)
            state.studentData = state.studentData.filter(s => s._id !== action.payload)

        },
        modifyStudent_batch: (state, action) => {
            const { _id, firstName, lastName, studentEmail, studentId, studentDOB } = action.payload
            let temp = state.studentData.find(s => s._id === _id)
            if (temp) {
                temp.studentName.firstName = firstName;
                temp.studentName.lastName = lastName;
                temp.studentEmail = studentEmail;
                temp.studentId = studentId;
                temp.studentDOB = studentDOB
            }
        },
        addOneStudent_batch: (state, action) => {
            state.data.studentList.push({ studentId: action.payload._id })
            state.studentData.push(action.payload)
        },

        removeExam_batch: (state, action) => {
            state.data.examinationList = state.data.examinationList.filter(exam => exam.examinationId !== action.payload)
        }
    }
})

export const { addBatch, modifyBatch, removeBatch, updateSemester, addAnnouncement_batch, removeAnnouncement_batch, addStudentInfos, removeStudentInfo_batch, modifyStudent_batch, addOneStudent_batch, removeExam_batch } = batchSlice.actions;
export default batchSlice.reducer;