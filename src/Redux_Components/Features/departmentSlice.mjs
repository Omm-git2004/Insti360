import { createSlice } from "@reduxjs/toolkit";
import { statusCode } from "../../utils/statusFile.mjs";

const initialState = {
    data: null,
    status: statusCode.EMPTY
}

const departmentSlice = createSlice({
    name: "department",
    initialState,
    reducers: {
        addDepartments: (state, action) => {
            state.data = action.payload;
            state.status = statusCode.IDLE
        },
        modifyDepartments: (state, action) => {
            state.data.departmentName = action.payload.deptName.trim().toUpperCase();
            state.data.headOfDepartment = action.payload.hod;
        },
        removeDepartments: (state, action) => {
            state.data = null;
            state.status = statusCode.EMPTY;
        },
        addPaper_dept: (state, action) => {
            state.data.papers.push(action.payload)
        },
        modifyPaper_dept: (state, action) => {
            const { oldPaperName, newPaperName, semester } = action.payload

            let oldPaper = state.data.papers.find(p => p.name === oldPaperName)

            oldPaper.name = newPaperName;
            oldPaper.semester = semester;
        },
        removePaper_dept: (state, action) => {
            state.data.papers = state.data.papers.filter(p => p.name !== action.payload)
        },
        addAnnouncement_dept: (state, action) => {
            state.data.announcements.push(action.payload)
        },
        removeAnnouncement_dept: (state, action) => {
            state.data.announcements = state.data.announcements.filter(ann => ann._id !== action.payload)
        },
        addFaculty_dept: (state, action) => {
            state.data.facultyList.push(action.payload)
        },
        modifyFaculty_dept: (state, action) => {
            const { facultyId, facultyDeptId } = action.payload;
            let temp = state.data.facultyList.find(fac => fac.facultyId === facultyId)
            if (temp) temp.facultyDeptId = facultyDeptId
        },
        removeFaculty_dept: (state, action) => {
            state.data.facultyList = state.data.facultyList.filter(fac => fac.facultyId !== action.payload)
        },

        // Batches
        addBatches_dept: (state, action) => {
            state.data.batches = action.payload;
        },
        removeBatch_dept: (state, action) => {
            state.data.batches = state.data.batches.filter(batch => batch.batchName !== action.payload)
        },

        // Students
        removeStudent_dept: (state, action) => {
            const { batchName, sid } = action.payload;
            let batch = state.data.batches.find(b => b.batchName === batchName)
            batch.studentList = batch.studentList.filter(s => s._id !== sid)
        },
        addStudent_dept: (state, action) => {
            const { batchName, studentId } = action.payload;
            let batch = state.data.batches.find(batch => batch.batchName === batchName)

            if (batch) batch.studentList.push({ studentId })
        },

        // Admin
        addAdmin_dept: (state, action) => {
            state.data.adminMail = action.payload
        },
        removeAdmin_dept: (state, action) => {
            state.data.adminMail = ""
        }
    }
})

export const { addDepartments, modifyDepartments, removeDepartments,
    addPaper_dept, modifyPaper_dept, removePaper_dept,
    addAnnouncement_dept, removeAnnouncement_dept,
    addFaculty_dept, modifyFaculty_dept, removeFaculty_dept,
    addBatches_dept, removeBatch_dept,
    removeStudent_dept, addStudent_dept,
    addAdmin_dept, removeAdmin_dept
} = departmentSlice.actions;

export default departmentSlice.reducer;