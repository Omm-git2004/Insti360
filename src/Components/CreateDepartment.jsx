import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { toast } from "react-toastify"
import { createDepartment } from "../Redux_Components/Features/instituteSlice.mjs";
import { useLoadingContext } from "../Context_API/LoadingContext";
import FormPopUp from "./Others/FormPopUp"

export default ({ onClose }) => {

    const { data: instituteInfo } = useSelector(state => state.institute)
    const dispatch = useDispatch()

    const { isloading, setIsloading } = useLoadingContext()

    const [departmentInfo, setDepartmentInfo] = useState({
        departmentName: "",
        hod: ""
    })

    const handleUpdate = (e) => {
        const { name, value } = e.target;
        setDepartmentInfo({
            ...departmentInfo,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsloading(true)

        axios.post("admin/handleDepartment", { departmentInfo, instituteInfo })
            .then(res => {
                setIsloading(false)
                const { status, message } = res.data;

                if (!status) return toast(message)

                dispatch(createDepartment(message))
                onClose()
            })
            .catch(err => {
                setIsloading(false)
                console.error(`Error : department creation --> ${err}`)
                toast("Network connection error")
            })
    }

    const formElems = [
        { type: "text", label: "Department Name", name: "departmentName", placeholder: "Enter the department name", onChange: (e) => handleUpdate(e) },
        { type: "text", label: "Head Of Department", name: "hod", placeholder: "Enter the Head of department name", onChange: (e) => handleUpdate(e) }
    ]

    return (
        <FormPopUp onClose={onClose} onSubmit={handleSubmit} formElems={formElems} />
    )
}