import React from 'react';
import { Link } from 'react-router-dom';
import { faFacebook, faInstagram, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-logo">
                <img src={`/logo.png`} alt="Logo" />
            </div>
            <div className="footer-content">
                <div className="footer-section about">
                    <h2>About Us</h2>
                    <p>Your text here about your company or website.</p>
                    <div className="contact">
                        <span><i className="fa fa-map-marker"></i> Address: 123 Street, City, Country</span>
                        <span><i className="fa fa-phone"></i> Phone: +1234567890</span>
                        <span><i className="fa fa-envelope"></i> Email: info@example.com</span>
                    </div>
                </div>
                <div className="footer-section links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className="footer-section social">
                    <h2>Follow Us</h2>
                    <div className="social-icons">
                        <Link to="#"><FontAwesomeIcon icon={faFacebook} /></Link>
                        <Link to="#"><FontAwesomeIcon icon={faInstagram} /></Link>
                        <Link to="#"><FontAwesomeIcon icon={faTwitter} /></Link>
                        <Link to="https://www.linkedin.com/in/siva-sankar-sahoo-6b648a23a"><FontAwesomeIcon icon={faLinkedin} /></Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; 2024 insti360.com | Designed by Siva Sankar Sahoo
            </div>
        </footer>
    );
};

export default Footer;