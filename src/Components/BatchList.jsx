import { useNavigate } from "react-router-dom";
import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { addBatches_dept } from "../Redux_Components/Features/departmentSlice.mjs"
import { addBatch } from "../Redux_Components/Features/batchSlice.mjs"
import CreateBatch from "./CreateBatch";
import { useLoadingContext } from "../Context_API/LoadingContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default ({ batchList, deptId }) => {

    const { data: admin } = useSelector(state => state.admin)

    const [canAdd, setCanAdd] = useState(false)
    const { setIsloading } = useLoadingContext()


    const [batchInfo, setBatchInfo] = useState({
        batchName: "",
        semester: ""
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { value, name } = e.target;
        setBatchInfo({
            ...batchInfo,
            [name]: value
        })
    }

    const handleCancel = () => {
        setCanAdd(false)
        setBatchInfo({
            batchName: "",
            semester: ""
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsloading(true)

        axios.post(`admin/handleBatch/${deptId}`, batchInfo)
            .then(res => {
                setIsloading(false)
                const { status, message } = res.data;
                if (!status) return toast(message)

                dispatch(addBatches_dept(message.batches))
                setCanAdd(false)
                toast("Batch Creation Successfully")
            })
            .catch(err => {
                setIsloading(false)
                console.error(`Creating batch --> ${err}`)
                toast("Network connection error")
            })
    }

    const getBatch = (batchName) => {
        axios.get(`admin/getBatchInfo/?deptId=${deptId}&batchName=${batchName}`)
            .then(res => {
                const { status, message } = res.data;
                if (!status) return toast(message)

                dispatch(addBatch(message.batches[0]))
                navigate(`batch/${batchName}`, { state: deptId }) // navigate to the batch page
            })
            .catch(err => {
                console.error(`Retrieving batch info --> ${err}`)
                if (err.response.status === 404) return toast(err.response.data.message)
                toast("Network connection error")
            })
    }

    return (
        <section className="departmentList-wrapper">
            <div className="header">
                <h2>Batch List</h2>
            </div>
            {
                canAdd
                    ? <CreateBatch handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel} />
                    : <div className="content">
                        {
                            admin && <div className="btn-container">
                                <button onClick={() => setCanAdd(true)} className="create-btn">
                                    <FontAwesomeIcon icon={faPlus} /> Create Batch
                                </button>
                            </div>
                        }
                        <div className="departmentList-container">
                            {
                                batchList.length > 0
                                    ? batchList.map(batch => (
                                        <button
                                            key={batch.batchName}
                                            onClick={() => getBatch(batch.batchName)}
                                            className="blue-btn"
                                        >
                                            {batch.batchName}
                                        </button>
                                    ))
                                    : <p>Batch List is empty</p>
                            }
                        </div>
                    </div>
            }
        </section>
    )
}