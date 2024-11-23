import axios from "axios"
import { toast } from "react-toastify"
import { addAnnouncement_dept, removeAnnouncement_dept } from "../Redux_Components/Features/departmentSlice.mjs"
import { useDispatch, useSelector } from "react-redux"
import { useRef, useState } from "react"
import { addAnnouncement_batch, removeAnnouncement_batch } from "../Redux_Components/Features/batchSlice.mjs"
import { addAnnouncement_insti, removeAnnouncement_insti } from "../Redux_Components/Features/instituteSlice.mjs"
import { useLoadingContext } from "../Context_API/LoadingContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faSpinner, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import PopWindow from "./Others/PopWindow"

export default ({ deptId, announcements, batchName, type, instituteId }) => {

    const dispatch = useDispatch()
    const inputField = useRef()
    const { data: admin, isSuperAdmin } = useSelector(state => state.admin)

    const { isloading, setIsloading, isRemoving, setIsRemoving } = useLoadingContext()

    const [removeAnnouncement_id, setRemoveAnnouncement_id] = useState(null)

    const deleteAnnouncement = (id) => {
        setIsRemoving(true)
        axios.delete(`admin/handle${type}Announcement/${type === "Institute" ? instituteId : deptId}/?announcementId=${id}&batchName=${batchName}`)
            .then(res => {
                const { status, message } = res.data;
                toast(message)

                if (status) {
                    if (type === "Institute") dispatch(removeAnnouncement_insti(id))
                    else if (type === "Department") dispatch(removeAnnouncement_dept(id))
                    else dispatch(removeAnnouncement_batch(id))
                }
            })
            .catch(err => {
                console.error(`Deleting announcement --> ${err}`)
                toast("Network connection error")
            })
            .finally(() => {
                setIsRemoving(false)
                setRemoveAnnouncement_id(null)
            })
    }

    const [announcement, setAnnouncement] = useState("")

    const handleSend = () => {
        setIsloading(true)
        axios.post(`admin/handle${type}Announcement/${type === "Institute" ? instituteId : deptId}/?batchName=${batchName}`, { announcement })
            .then(res => {
                const { status, message } = res.data;
                setIsloading(false)
                if (!status) return toast(message)

                setAnnouncement("")
                inputField.current.value = ""

                if (type === "Institute") dispatch(addAnnouncement_insti(message))
                else if (type === "Department") dispatch(addAnnouncement_dept(message))
                else dispatch(addAnnouncement_batch(message))

            })
            .catch(err => {
                setIsloading(false)
                console.error(`Sending announcement --> ${err}`)
                toast("Network connection error")
            })
    }

    return (
        <section className="announcement-container">
            {removeAnnouncement_id && <PopWindow userType={"Announcement"} onClose={() => setRemoveAnnouncement_id(null)} onProceed={() => deleteAnnouncement(removeAnnouncement_id)} />}
            <div className="header">
                <h2>{type} Announcement</h2>
            </div>
            <div className="announcement-list">
                {
                    announcements.length > 0
                        ? announcements.map((announcement) => (

                            <div key={announcement._id} className={`announcement-item`}  >
                                <p className="announcement-message">{announcement.announcement}</p>
                                <p className="announcement-datetime">{announcement.date} {announcement.time}</p>
                                {
                                    type === "Institute"
                                        ? isSuperAdmin && <button onClick={() => setRemoveAnnouncement_id(announcement._id)} disabled={isRemoving || isloading} className="tiny-btn remove-btn" >
                                            <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} />
                                        </button>
                                        : admin && <button onClick={() => setRemoveAnnouncement_id(announcement._id)} disabled={isRemoving || isloading} className="tiny-btn remove-btn" >
                                            <FontAwesomeIcon icon={isRemoving ? faSpinner : faTrashCan} spin={isRemoving} />
                                        </button>
                                }
                            </div>

                        ))
                        : <div style={{
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center",
                            marginTop:"25%",
                            fontWeight:"bold",
                            fontSize:"24px"
                        }} >Nothing to show</div>
                }
            </div>
            {
                type === "Institute"
                    ? isSuperAdmin && <form className="announcement-form">
                        <textarea
                            className="announcement-input"
                            type="text"
                            placeholder="Enter your message"
                            onChange={(e) => setAnnouncement(e.target.value)}
                            ref={inputField}
                        />
                        <button
                            onClick={() => { announcement !== "" && handleSend() }}
                            disabled={isRemoving || isloading}
                            className="announcement-button"
                        >
                            <FontAwesomeIcon icon={isloading ? faSpinner : faPaperPlane} spin={isloading} />
                        </button>
                    </form>
                    : admin && <form className="announcement-form">
                        <textarea
                            className="announcement-input"
                            type="text"
                            placeholder="Enter your message"
                            onChange={(e) => setAnnouncement(e.target.value)}
                            ref={inputField}
                        />
                        <button
                            onClick={() => { announcement !== "" && handleSend() }}
                            disabled={isRemoving || isloading}
                            className="announcement-button"
                        >
                            <FontAwesomeIcon icon={isloading ? faSpinner : faPaperPlane} spin={isloading} />
                        </button>
                    </form>
            }
        </section>
    )
}