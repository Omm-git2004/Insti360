import { createSlice } from "@reduxjs/toolkit";
import { statusCode } from "../../utils/statusFile.mjs";

const initialState = {
    data: null,
    status: statusCode.EMPTY
}

const instituteSlice = createSlice({
    name: "institute",
    initialState,
    reducers: {
        addInstitute: (state, action) => {
            state.data = action.payload;
            state.status = statusCode.IDLE
        },
        modifyInstitute: (state, action) => {
            state.data.instituteName = action.payload;
        },
        removeInstiute: (state, action) => {
            state.data = null;
            state.status = statusCode.EMPTY
        },
        createDepartment: (state, action) => {
            state.data.departments.push(action.payload)
        },
        modifyDepartment_insti: (state, action) => {
            let temp = state.data.departments.find(dept => dept.departmentId === action.payload.deptId)
            if (temp) temp.departmentName = action.payload.deptName.trim().toUpperCase();
        },
        removeDepartment_institute: (state, action) => {
            state.data.departments = state.data.departments.filter(dept => dept.departmentId !== action.payload)
        },
        addAnnouncement_insti: (state, action) => {
            state.data.announcements.push(action.payload)
        },
        removeAnnouncement_insti: (state, action) => {
            state.data.announcements = state.data.announcements.filter(ann => ann._id !== action.payload)
        }
    }
})

export const { addInstitute, modifyInstitute, removeInstiute, createDepartment, modifyDepartment_insti, removeDepartment_institute, addAnnouncement_insti, removeAnnouncement_insti } = instituteSlice.actions;
export default instituteSlice.reducer;