import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useLoadingContext } from "../Context_API/LoadingContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBan, faCheck, faPenToSquare, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { modifyBatch } from "../Redux_Components/Features/batchSlice.mjs"

export default () => {

    const { data: admin } = useSelector(state => state.admin)
    const { data: deptData } = useSelector(state => state.department)
    const { data: batchData } = useSelector(state => state.batch)

    const { isloading, setIsloading } = useLoadingContext()
    const dispatch = useDispatch()

    const [newBatchName, setNewBatchName] = useState(batchData?.batchName)
    const [newSemester, setNewSemester] = useState(batchData?.semester)
    const [canModify, setCanModify] = useState(false)

    const modify = () => {
        setIsloading(true)
        axios.put(`admin/handleBatch/${deptData._id}`, { oldBatchName: batchData.batchName, newBatchName, newSemester })
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    dispatch(modifyBatch({ newBatchName, newSemester }))
                    setCanModify(false)
                }
                else {
                    setNewBatchName(batchData.batchName)
                    setNewSemester(batchData.semester)
                }
                toast(message)
            })
            .catch(err => {
                console.error(`Modifing batch --> ${err}`)
                toast("Network connection error")
            }
            )
            .finally(() => setIsloading(false))
    }

    const formElem = [
        { type: "text", id: "batchName", disabled: !canModify, defaultValue: newBatchName, onChange: (e) => setNewBatchName(e.target.value), label: "Batch Name" },
        { type: "number", id: "semester", disabled: !canModify, defaultValue: newSemester, onChange: (e) => setNewSemester(e.target.value), label: "Semester" },
        { type: "text", id: "creationTime", disabled: true, defaultValue: batchData?.creationDate.time, label: "Creation Time", onChange: () => { } },
        { type: "text", id: "creationDate", disabled: true, defaultValue: batchData?.creationDate.date, label: "Creation Date", onChange: () => { } }
    ]

    return (
        <div className="account-container">
            <div className="header">
                <h2>Batch&nbsp;Account</h2>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="account-form">
                {
                    formElem.map(({ type, id, disabled, defaultValue, label, onChange }) => (
                        <div key={id} className="form-group" >
                            <label htmlFor={id}>{label}</label>
                            {
                                disabled
                                    ? <input type={type} id={id} disabled value={defaultValue} />
                                    : <input type={type} id={id} defaultValue={defaultValue} onChange={onChange} />
                            }

                        </div>
                    ))
                }
                <div className="edit-buttons">
                    {
                        canModify
                            ? <div>
                                <button onClick={modify} disabled={isloading} className="save-btn">
                                    <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                    {isloading ? " Saving Changes..." : " Save Changes"}
                                </button>
                                <button onClick={() => {
                                    setCanModify(false);
                                    setNewBatchName(batchData?.batchName)
                                    setNewSemester(batchData?.semester)
                                }} disabled={isloading} className="cancel-btn">
                                    <FontAwesomeIcon icon={faBan} spin /> Cancel
                                </button>
                            </div>
                            : <div>
                                {admin && <button onClick={() => setCanModify(true)} className="violet-btn" >
                                    <FontAwesomeIcon icon={faPenToSquare} /> &nbsp;Modify
                                </button>}
                            </div>
                    }
                </div>
            </form>
        </div>
    )
}