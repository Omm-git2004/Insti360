import React, { useState } from 'react';
import axios from "axios"
import { toast } from "react-toastify"

export default () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("contactUs", { email, username, message })
            .then(res => {
                const { status, message: msg } = res.data
                if (status) {
                    setEmail('');
                    setUsername('');
                    setMessage('');
                }
                toast(msg)
            })
            .catch(err => {
                console.error(`contact error --> ${err}`)
                toast("Network connection error")
            })


    };

    return (
        <section className="contact-section">
            <div className="container">
                <h2>Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email ID</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Fullname</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="5"
                            required
                        ></textarea>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </section>
    );
};
