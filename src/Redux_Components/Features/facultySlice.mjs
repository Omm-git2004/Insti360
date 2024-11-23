import { createSlice } from "@reduxjs/toolkit";
import { statusCode } from "../../utils/statusFile.mjs";

const initialState = {
    data: null,
    status: statusCode.EMPTY
}

const facultySlice = createSlice({
    name: "faculty",
    initialState,
    reducers: {
        addFaculty: (state, action) => {
            state.data = action.payload;
            state.status = statusCode.IDLE
        },
        modifyFaculty: (state, action) => {
            state.data.facultyPass = action;
        },
        removeFaculty: (state, action) => {
            state.data = null;
            state.status = statusCode.EMPTY;
        }
    }
})

export const { addFaculty, modifyFaculty, removeFaculty } = facultySlice.actions;
export default facultySlice.reducer;