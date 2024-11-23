import { useState } from "react"
import CreatePaper from "./CreatePaper"
import axios from "axios"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { addPaper_dept, modifyPaper_dept, removePaper_dept } from "../Redux_Components/Features/departmentSlice.mjs"
import { useLoadingContext } from "../Context_API/LoadingContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faClose, faPenToSquare, faPlus, faSpinner, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import PopWindow from "./Others/PopWindow"

export default ({ deptId, papers }) => {

    const { data: admin } = useSelector(state => state.admin)

    const [canAdd, setCanAdd] = useState(false)

    const [removePaper_name, setRemovePaper_name] = useState(null)

    const [paperInfo, setPaperInfo] = useState({
        name: "",
        semester: ""
    })

    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext()

    const [modifingPaper, setModifingPaper] = useState("")

    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaperInfo({
            ...paperInfo,
            [name]: value
        })
    }

    const handleCancel = () => {
        setCanAdd(false)
        setPaperInfo({
            name: "",
            semester: ""
        })
    }

    const addPaper = (e) => {

        e.preventDefault()

        setIsloading(true)

        axios.post(`admin/handleDepartmentPapers/${deptId}`, paperInfo)
            .then(res => {
                setIsloading(false)
                const { status, message } = res.data;
                toast(message)

                if (status) {
                    dispatch(addPaper_dept(message))
                    handleCancel()
                }
            })
            .catch(err => {
                setIsloading(false)
                console.error(`Creating paper --> ${err}`)
                toast("Network connection error")
            })
    }

    const modifyPaper = () => {
        setIsloading(true)
        axios.put(`admin/handleDepartmentPapers/${deptId}`, { oldPaperName: modifingPaper, newPaperName: paperInfo.name, semester: paperInfo.semester })
            .then(res => {
                setIsloading(false)
                const { status, message } = res.data;
                toast(message)
                if (status) {
                    dispatch(modifyPaper_dept({ oldPaperName: modifingPaper, newPaperName: paperInfo.name, semester: paperInfo.semester }))
                    setModifingPaper("")
                    setPaperInfo({
                        name: "",
                        semester: ""
                    })
                }
            })
            .catch(err => {
                setIsloading(false)
                console.error(`MOdifing paper --> ${err}`)
                toast("Network connection error")
            })
    }

    const removePaper = (paperName) => {
        const encodedPaperName = encodeURIComponent(paperName); // As the papername may contain special character and passing a string ending with a special character to url might cause problem.
        setIsRemoving(true)
        axios.delete(`admin/handleDepartmentPapers/${deptId}/?paperName=${encodedPaperName}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message)
                if (status) {
                    dispatch(removePaper_dept(paperName))
                }
            })
            .catch(err => {
                console.error(`Removing paper --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => {
                setIsRemoving(false)
                setRemovePaper_name(null)
            })
    }

    return (
        <section className="departmentList-wrapper">
            {removePaper_name && <PopWindow onClose={() => setRemovePaper_name(null)} onProceed={() => removePaper(removePaper_name)} userType={"Paper"} />}
            <div className="header">
                <h2>Paper List</h2>
            </div>
            {
                canAdd
                    ? <CreatePaper handleCancel={handleCancel} handleChange={handleChange} handleSubmit={addPaper} />
                    : <div className="content">
                        {
                            admin && <div className="btn-container">
                                <button
                                    className="create-btn"
                                    onClick={() => setCanAdd(true)}
                                    disabled={isloading || isRemoving}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Add Paper
                                </button>
                            </div>
                        }
                        <div className="table-div">
                            {
                                papers.length > 0
                                    ? <table className="paperList-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Semester</th>
                                                {admin && <th>Action</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                papers.map(paper => (
                                                    <tr key={paper.name}>
                                                        <td>
                                                            {
                                                                paper.name !== modifingPaper
                                                                    ? <p>{paper.name}</p>
                                                                    : <input type="text" defaultValue={paper.name} onChange={handleChange} name="name" />
                                                            }

                                                        </td>
                                                        <td>
                                                            {
                                                                paper.name !== modifingPaper
                                                                    ? <p>{paper.semester}</p>
                                                                    : <input type="number" name="semester" defaultValue={paper.semester} onChange={handleChange} />
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                paper.name === modifingPaper
                                                                    ? <>
                                                                        <button onClick={modifyPaper} disabled={isloading || isRemoving} className="tiny-btn save-btn" >
                                                                            <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                                                        </button>
                                                                        <button onClick={() => {
                                                                            setModifingPaper("")
                                                                            setPaperInfo({
                                                                                name: "",
                                                                                semester: ""
                                                                            })
                                                                        }} disabled={isloading || isRemoving} className="tiny-btn remove-btn" >
                                                                            <FontAwesomeIcon icon={faClose} />
                                                                        </button>
                                                                    </>
                                                                    : admin && <>
                                                                        <button onClick={() => {
                                                                            setModifingPaper(paper.name)
                                                                            setPaperInfo({
                                                                                name: paper.name, semester: paper.semester
                                                                            })
                                                                        }} disabled={isloading || isRemoving} className="tiny-btn edit-btn" >
                                                                            <FontAwesomeIcon icon={isloading ? faSpinner : faPenToSquare} spin={isloading} />
                                                                        </button>
                                                                        <button onClick={() => setRemovePaper_name(paper.name)} disabled={isloading || isRemoving} className="tiny-btn remove-btn" >
                                                                            <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} />
                                                                        </button>
                                                                    </>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    : <p>Paper list is empty</p>
                            }
                        </div>
                    </div>
            }
        </section>
    )
}