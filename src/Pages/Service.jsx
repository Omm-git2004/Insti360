import { Helmet } from "react-helmet";

const Service = () => {
  return (
    <div className="service-page">

      <Helmet>
        <title>Services Insti360 - Comprehensive Institute Management</title>
        <meta name="robots" content="index, follow" />
        <meta
          name="description"
          content="Learn more about Insti360, a comprehensive platform for managing educational institutions, departments, and academic tasks."
        />
        <meta
          name="keywords"
          content="Insti360, institute management, educational platform, departments, batches, assignments, exams, AI-powered questions"
        />
      </Helmet>

      <header className="service-header">
        <img
          src={`/logo_black.png`}
          alt="Insti360 Logo"
          className="service-logo"
        />
        <h1 className="service-title">Insti360 - Comprehensive Institute Management</h1>
        <p className="service-tagline">
          Revolutionizing institute operations with modern tools and AI-driven solutions.
        </p>
      </header>

      <section className="service-cards">
        <h2 className="section-heading">Core Services</h2>
        <div className="service-card-container">
          <div className="service-card">
            <h3>Institute Account Creation</h3>
            <p>
              Create an institute account to kickstart the journey of organized and
              efficient management. Customize settings according to your institute’s unique requirements.
            </p>
          </div>
          <div className="service-card">
            <h3>Super Admin Control</h3>
            <p>
              The super admin holds complete control over the platform:
              <ul>
                <li>Create, update, or delete departments and batches.</li>
                <li>Manage faculty and student accounts seamlessly.</li>
                <li>Publish institute-wide announcements.</li>
              </ul>
            </p>
          </div>
          <div className="service-card">
            <h3>Department-Level Management</h3>
            <p>
              Assign department-specific administrators with limited access:
              <ul>
                <li>Manage department faculty and student records.</li>
                <li>Make announcements targeting specific batches or the entire department.</li>
              </ul>
            </p>
          </div>
        </div>
      </section>

      <section className="service-cards">
        <h2 className="section-heading">Academic Tools</h2>
        <div className="service-card-container">
          <div className="service-card">
            <h3>Batch Organization</h3>
            <p>
              Allocate students to specific batches under departments, making it easy
              to manage class schedules, assignments, and academic records.
            </p>
          </div>
          <div className="service-card">
            <h3>Faculty Dashboards</h3>
            <p>
              Empower faculty with dedicated dashboards to:
              <ul>
                <li>Create assignments with clear instructions and deadlines.</li>
                <li>Generate question papers for exams with AI assistance (premium feature).</li>
                <li>Track student submissions and progress efficiently.</li>
              </ul>
            </p>
          </div>
          <div className="service-card">
            <h3>Student Dashboards</h3>
            <p>
              Provide students with a centralized hub to:
              <ul>
                <li>Access assignments and submit work before deadlines.</li>
                <li>View exam schedules and prepare accordingly.</li>
                <li>Receive department or institute-level announcements in real-time.</li>
              </ul>
            </p>
          </div>
        </div>
      </section>

      <section className="service-premium">
        <h2>Premium Features</h2>
        <p>
          Take your institute’s management to the next level with our premium features:
        </p>
        <ul>
          <li>
            <strong>AI-Driven Question Generation:</strong> Save time with AI-assisted
            question paper creation, tailored to your subjects and difficulty levels.
          </li>
          <li>
            <strong>Flexible Submissions:</strong> Allow students to upload PDF files
            directly instead of manual entries.
          </li>
          <li>
            <strong>Enhanced Administrative Tools:</strong> Advanced analytics and
            insights to monitor the overall performance of departments, batches, and faculty.
          </li>
        </ul>
      </section>

      <footer className="service-footer">
        <p>
          Contact us at <a href="mailto:contact.insti360@gmail.com">contact@insti360.com</a>
        </p>
        <p>&copy; 2024 Insti360. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Service;
