import { useState } from "react"
import ShowFaculty from "./ShowFaculty"
import CreateFaculty from "./CreateFaculty"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserTie } from "@fortawesome/free-solid-svg-icons"

export default ({ deptId, faculties }) => {

    const [facultyId, setFacultyId] = useState(null)
    const [canAddFaculty, setCanAddFaculty] = useState(false)

    const { data: admin } = useSelector(state => state.admin)

    return (
        <section className="departmentList-wrapper">
            <div className="header">
                <h2>Faculty List</h2>
            </div>
            {
                canAddFaculty
                    ? <CreateFaculty deptId={deptId} close={() => setCanAddFaculty(false)} />
                    : <div className="content">
                        <div className="btn-container">
                            {
                                admin && !canAddFaculty &&
                                <button
                                    onClick={() => setCanAddFaculty(true)}
                                    className="create-btn"
                                >
                                    <FontAwesomeIcon icon={faUserTie} /> Create Faculty
                                </button>
                            }
                        </div>
                        <div className="departmentList-container">
                            {
                                faculties.length > 0
                                    ? !facultyId &&
                                    faculties.map(faculty => (
                                        <button
                                            key={faculty.facultyId}
                                            onClick={() => setFacultyId(faculty.facultyId)}
                                            className="blue-btn"
                                        >
                                            {faculty.facultyDeptId}
                                        </button>
                                    ))
                                    : <p>
                                        Faculty List is empty
                                    </p>
                            }
                        </div>
                        {
                            facultyId && <ShowFaculty faculty={null} deptId={deptId} faculty_id={facultyId} goBack={() => setFacultyId(null)} />
                        }
                    </div>
            }

        </section>
    )
}