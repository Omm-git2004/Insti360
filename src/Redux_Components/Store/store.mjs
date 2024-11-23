import { configureStore } from "@reduxjs/toolkit";
import instituteSlice from "../Features/instituteSlice.mjs";
import departmentSlice from "../Features/departmentSlice.mjs";
import adminSlice from "../Features/adminSlice.mjs";
import studentSlice from "../Features/studentSlice.mjs";
import batchSlice from "../Features/batchSlice.mjs";
import facultySlice from "../Features/facultySlice.mjs";

const store = configureStore({
    reducer: {
        institute: instituteSlice,
        department: departmentSlice,
        admin: adminSlice,
        student: studentSlice,
        batch: batchSlice,
        faculty: facultySlice
    }
})

export default store;