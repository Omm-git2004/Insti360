import { NavLink } from "react-router-dom";

const UserPage = () => {
    return (
        <section className="card-container">
            <div className="card">
                <img src={`/adminIcon.png`} alt="adminIcon" className="card-image" />
                <h3>Admin Login</h3>
                <p>Access the admin panel</p>
                <NavLink to={`/login/Admin`} className="card-btn">Login</NavLink>
            </div>
            <div className="card">
                <img src={`/teacherIcon.png`} alt="teacherIcon" className="card-image" />
                <h3>Faculty Login</h3>
                <p>Access the faculty dashboard</p>
                <NavLink to={`/login/Faculty`} className="card-btn">Login</NavLink>
            </div>
            <div className="card">
                <img src={`/studentIcon.png`} alt="studentIcon" className="card-image" />
                <h3>Student Login</h3>
                <p>Access the student portal</p>
                <NavLink to={`/login/Student`} className="card-btn">Login</NavLink>
            </div>
        </section>
    );
}

export default UserPage;

// This page will have three links to navigate to the login page according to the user preference