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
                    <p style={{color:"white",marginBottom:"15px"}}>Insti360 is a comprehensive institute management platform to manage departments, assignments, exams, student profiles, and more for educational institutions.</p>
                    <div className="contact">
                        <span><i className="fa fa-map-marker"></i> Address: Chandrasekhar Pur, Bhubaneswar, India</span>
                        <span><i className="fa fa-phone"></i> Phone: +917609097828</span>
                        <span><i className="fa fa-envelope"></i> Email: contact.insti360@gmail.com</span>
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
                <div className="footer-section links">
                    <h2>More</h2>
                    <ul>
                        <li><Link to="/terms&conditions">Terms & Conditions</Link></li>
                        <li><Link to="/privacyPolicy">Privacy Policy</Link></li>
                        <li><Link to="/cancellationAndRefunding">Cancellation and Refund</Link></li>
                        <li><Link to="/shippingAndDelivery">Shipping and Delivery</Link></li>
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