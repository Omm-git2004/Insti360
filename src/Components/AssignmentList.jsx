import { useState } from "react"
import AssignmentInfo from "./AssignmentInfo"
import { useSelector } from "react-redux"

export default ({ assignments, deptId, type, onRemove, isVisiting, getAssignments }) => {
    const [showAssignment, setShowAssignment] = useState(null)
    const { data: studentData } = useSelector(state => state.student)

    return (
        <div className="departmentList-container">
            {
                assignments.length > 0
                    ? showAssignment
                        ? <AssignmentInfo key={showAssignment._id} isVisiting={isVisiting} onRemove={onRemove} assignmentInfo={showAssignment} deptId={deptId} type={type} setAssignment={setShowAssignment} getAssignments={()=>getAssignments(assignments[0].subject)} />
                        : assignments.map((assignment, index) => (
                            <button key={assignment._id}
                                onClick={() => setShowAssignment(assignment)}
                                style={{
                                    backgroundColor: studentData
                                        ? assignment.studentList.some(std => std.studentId === studentData.studentId) ? "green" : "red"
                                        : "#ff7f00"
                                }}
                            >
                                <p>Assignment{index + 1}</p>
                                <p>{assignment.assignment.slice(0, 12)}...</p>
                            </button>
                        ))
                    : <p>Assignment List is empty</p>
            }
        </div>
    )
}