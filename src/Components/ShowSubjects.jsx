export default ({ onClick, subjects }) => {
    return (
        subjects.length > 0
            ? <div>
                {
                    subjects.map(sub => (
                        <button onClick={() => onClick(sub)} key={sub} className="blue-btn">{sub}</button>
                    ))
                }
            </div>
            : <p>Subject list is empty</p>
    )
}