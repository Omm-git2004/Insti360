import { createSlice } from "@reduxjs/toolkit";
import { statusCode } from "../../utils/statusFile.mjs";

const initialState = {
    data: null,
    status: statusCode.EMPTY,
    isSuperAdmin: false
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        addAdmin: (state, action) => {
            const { admin, isSuperAdmin } = action.payload;
            state.data = admin;
            state.isSuperAdmin = isSuperAdmin;
            state.status = statusCode.IDLE;
        },
        modifyAdmin: (state, action) => {
            const { adminFirstName, adminLastName, mobileNumber, designation } = action.payload;
            state.data.adminFirstName = adminFirstName;
            state.data.adminLastName = adminLastName;
            state.data.designation = designation;
            state.data.mobileNumber = mobileNumber;
        },
        removeAdmin: (state, action) => {
            state.data = null;
            state.status = statusCode.EMPTY;
            state.isSuperAdmin = false
        }
    }
})

export const { addAdmin, modifyAdmin, removeAdmin } = adminSlice.actions;
export default adminSlice.reducer;