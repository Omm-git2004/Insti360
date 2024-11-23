import { Helmet } from "react-helmet";

const About = () => {
  return (
    <div className="about-page">

      <Helmet>
        <title>About Insti360 - Comprehensive Institute Management</title>
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


      <header className="about-header">
        <h1>About Insti360</h1>
        <p>
          Empowering educational institutions with a modern and efficient management system.
        </p>
      </header>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          At Insti360, our mission is to simplify and enhance the way educational
          institutions operate. We aim to bridge the gap between administration,
          faculty, and students through an intuitive platform.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          We envision a future where technology seamlessly integrates into education,
          creating a smarter, more connected, and collaborative environment for
          institutions worldwide.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Offer</h2>
        <ul>
          <li>
            Comprehensive tools for administrators to manage departments, batches, and accounts.
          </li>
          <li>
            Easy-to-use dashboards for faculty and students to handle academic tasks.
          </li>
          <li>
            Premium AI-powered features for exam question generation and advanced submissions.
          </li>
          <li>
            Real-time announcements for improved communication across all levels.
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Meet Our Team</h2>
        <p>
          Insti360 is brought to you by a passionate team of developers, designers,
          and educators who share a common goal: revolutionizing the educational
          management system.
        </p>
        <div className="team-container">
          <div className="team-card">
            <img src="/path/to/image1.jpg" alt="Team Member" />
            <h3>Siva Sankar Sahoo</h3>
            <p>Founder & Lead Developer</p>
          </div>
          <div className="team-card">
            <img src="/path/to/image2.jpg" alt="Team Member" />
            <h3>Jane Doe</h3>
            <p>UI/UX Designer</p>
          </div>
          <div className="team-card">
            <img src="/path/to/image3.jpg" alt="Team Member" />
            <h3>John Smith</h3>
            <p>AI Specialist</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>User Testimonials</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <p>
              "Insti360 has completely transformed how we manage our institute.
              The dashboard is intuitive, and the AI-powered question generation
              saves us so much time!"
            </p>
            <h4>- Dr. Ananya Sharma, Principal</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "As a faculty member, I love how easy it is to assign and track
              assignments. The student submission feature is a game-changer!"
            </p>
            <h4>- Mr. Rajesh Mehta, Mathematics Faculty</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "Being able to access all announcements and assignments in one place
              makes life so much easier as a student. Thank you, Insti360!"
            </p>
            <h4>- Priya Kapoor, Final Year Student</h4>
          </div>
        </div>
      </section>


      <footer className="about-footer">
        <p>
          Have questions? Contact us at{" "}
          <a href="mailto:support@insti360.com">support@insti360.com</a>
        </p>
        <p>&copy; 2024 Insti360. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
