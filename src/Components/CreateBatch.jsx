import { useLoadingContext } from "../Context_API/LoadingContext"
import FormPopUp from "./Others/FormPopUp"

export default ({ handleSubmit, handleChange, handleCancel }) => {

    const { isloading } = useLoadingContext()
    const formElems = [
        { type: "text", name: "batchName", placeholder: "Enter the batch name", onChange: (e) => handleChange(e), label: "Batch Name" },
        { type: "number", name: "semester", placeholder: "Enter the semester", onChange: (e) => handleChange(e), label: "Semester" }
    ]

    return (
        <FormPopUp onClose={handleCancel} onSubmit={handleSubmit} formElems={formElems} />
    )
}