import { createSlice } from "@reduxjs/toolkit";
import { statusCode } from "../../utils/statusFile.mjs";

const initialState = {
    data: null,
    status: statusCode.EMPTY
}

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        addStudent: (state, action) => {
            state.data = action.payload;
            state.status = statusCode.IDLE
        },
        modifyStudent: (state, action) => {
            state.data.studentPass = action;
        },
        removeStudent: (state, action) => {
            state.data = null;
            state.status = statusCode.EMPTY;
        }
    }
})

export const { addStudent, modifyStudent, removeStudent } = studentSlice.actions;
export default studentSlice.reducer;