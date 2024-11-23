import { useNavigate } from "react-router-dom";

const IndexPage = () => {

    const navigate = useNavigate()

    return (
        <div className="home-page">
            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to Insti360</h1>
                    <p>
                        Streamline your institute's management with our cutting-edge tools for
                        administrators, faculty, and students.
                    </p>
                    <button className="cta-button">Explore Features</button>
                </div>
                <div className="hero-image-container">
                    <img
                        src={`/heroSection.webp`}
                        alt="Modern Institute Management"
                        className="hero-image"
                    />
                </div>
            </header>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Why Insti360?</h2>
                <div className="features-container">
                    <div className="feature-card">
                        <img src={`/admin.jpg`} alt="Admin Tools" />
                        <h3>Efficient Admin Tools</h3>
                        <p>Centralized management of departments, accounts, and announcements.</p>
                    </div>
                    <div className="feature-card">
                        <img src={`/ai.jpg`} alt="Faculty Features" />
                        <h3>AI-Powered Faculty Features</h3>
                        <p>Create exams, assignments, and reports seamlessly with AI support.</p>
                    </div>
                    <div className="feature-card">
                        <img src={`/student.jpg`} alt="Student Features" />
                        <h3>Empowered Students</h3>
                        <p>Access assignments, submit exams, and stay updated on announcements.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2 className="section-title">How Insti360 Works</h2>
                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <p>Institute creates an account and sets up departments and batches.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <p>Admins, faculty, and students access their personalized dashboards.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <p>
                            Faculty create assignments and exams while students complete and
                            submit them.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <h2 className="section-title">What Our Users Say</h2>
                <div className="testimonials-container">
                    <div className="testimonial-card">
                        <p>
                            "Insti360 has revolutionized how we handle institute operations. The
                            tools are intuitive and save us so much time!"
                        </p>
                        <h4>- Dr. Kavita Rao</h4>
                    </div>
                    <div className="testimonial-card">
                        <p>
                            "The AI-powered exam creation is a standout feature. Our faculty and
                            students love the experience!"
                        </p>
                        <h4>- Mr. Ramesh Nair</h4>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <h2>Ready to Elevate Your Institute?</h2>
                <p>Join the growing community of institutes using Insti360 today.</p>
                <button className="cta-button" onClick={()=>navigate("/login/Institute")} >Get Started Now</button>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p>&copy; 2024 Insti360. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default IndexPage;
