import React from 'react';
import { portfolioData } from '../data';

const Footer = () => {
    const { email } = portfolioData;

    return (
        <footer className="footer" id="contact">
            <div className="footer-content">
                <h2>Let's Connect</h2>
                <p>Interested in working together or have a question?</p>
                <a href={`mailto:${email}`} className="contact-btn">Say Hello</a>

                <div className="copyright">
                    © {new Date().getFullYear()} {portfolioData.name}. All rights reserved.
                </div>
            </div>

            <style>{`
        .footer {
          background: linear-gradient(to top, var(--card-bg), transparent);
          padding: 2rem 2rem 4rem;
          text-align: center;
          margin-top: 0;
        }

        .footer p {
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }

        .contact-btn {
            display: inline-block;
            background: var(--accent-color);
            color: white;
            padding: 1rem 2.5rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(100, 108, 255, 0.4);
        }

        .contact-btn:hover {
            color: white;
            background: var(--accent-hover);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(100, 108, 255, 0.6);
        }

        .copyright {
            margin-top: 4rem;
            font-size: 0.8rem;
            color: #555;
        }
      `}</style>
        </footer>
    );
};

export default Footer;
