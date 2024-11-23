import FormPopUp from "./Others/FormPopUp"

export default ({ handleSubmit, handleChange, handleCancel }) => {

    const formElems = [
        { type: "text", name: "name", placeholder: "Enter the paper name", onChange: (e) => handleChange(e), label: "Paper Name" },
        { type: "number", name: "semester", placeholder: "Enter the semester", onChange: (e) => handleChange(e), label: "Semester" }
    ]

    return (
        <FormPopUp onClose={handleCancel} onSubmit={handleSubmit} formElems={formElems} />
    )
}