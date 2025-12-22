import "./HomePage.css"
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function HomePage(){
    const [hasToken, setHasToken] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token_apnisec_remember');
        setHasToken(!!token);
    }, []);

    const handleDashboard = () => {
        const token = localStorage.getItem('token_apnisec_remember');
        if (token) {
            navigate(`/dashboard/${token}`);
        }
    };

    return (
        <div className="apnisec-landing">
            <header className="apnisec-nav" role="banner">
                <div className="container nav-inner">
                    <Link to="/" className="logo" aria-label="ApniSec home">
                        <img src="https://assets.apnisec.com/public/apnisec-ui/logo.svg" alt="ApniSec logo" className="logo-img" />
                        <span className="brand">ApniSec</span>
                    </Link>

                    <nav className="main-links" role="navigation" aria-label="Main navigation">
                        <a href="#services">Services</a>
                        <a href="#why">Why ApniSec</a>
                        <a href="#contact">Contact</a>
                        {hasToken ? (
    <button className="btn btn-primary" onClick={handleDashboard}>Go to Dashboard</button>
) : (
    <Link to="/login" className="btn btn-primary">Login/ Register</Link>
)}
                    </nav>
                </div>
            </header>

            <main>
                <section className="hero" id="home">
                    <div className="container hero-inner">
                        <div className="hero-copy">
                            <h1>Protecting tomorrow's infrastructure, today.</h1>
                            <p className="lead">ApniSec delivers pragmatic cybersecurity — from proactive threat intelligence to 24/7 detection and response — so your business stays resilient and compliant.</p>
                            <div className="hero-ctas">
                                <a href="#contact" className="btn btn-primary">Get a Free Assessment</a>
                                <a href="#services" className="btn btn-ghost">Explore Services</a>
                            </div>
                            <ul className="trust-list" aria-hidden>
                                <li>ISO 27001 aligned</li>
                                <li>99.99% monitoring uptime</li>
                                <li>Trusted by enterprises</li>
                            </ul>
                        </div>
                        <div className="hero-art" aria-hidden>
                            <div className="shield">
                                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                                    <defs>
                                        <linearGradient id="lg" x1="0" x2="1"><stop offset="0" stopColor="#0ea5e9"/><stop offset="1" stopColor="#7c3aed"/></linearGradient>
                                    </defs>
                                    <path d="M50 5 L85 20 V45 C85 70 70 88 50 95 C30 88 15 70 15 45 V20 Z" fill="url(#lg)" opacity="0.95"/>
                                    <g fill="#fff">
                                        <rect x="30" y="40" width="40" height="6" rx="3"/>
                                        <rect x="30" y="52" width="26" height="6" rx="3"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="services" className="services container">
                    <h2>Our Services</h2>
                    <p className="section-lead">Comprehensive security solutions tailored for modern organisations.</p>
                    <div className="cards">
                        <article className="card" aria-labelledby="s1">
                            <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect rx='10' width='64' height='64' fill='%230f172a'/><text x='50%' y='55%' font-size='12' fill='%23fff' text-anchor='middle' font-family='Arial'>TI</text></svg>" alt="Threat intelligence icon"/>
                            <h3 id="s1">Threat Intelligence</h3>
                            <p>Actionable insights to identify adversaries, motive, and attack patterns before they impact you.</p>
                        </article>

                        <article className="card" aria-labelledby="s2">
                            <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect rx='10' width='64' height='64' fill='%237c3aed'/><text x='50%' y='55%' font-size='12' fill='%23fff' text-anchor='middle' font-family='Arial'>AS</text></svg>" alt="Assessment services icon"/>
                            <h3 id="s2">Security Assessments</h3>
                            <p>Risk-based pentests and architecture reviews to harden your cloud and on-prem footprint.</p>
                        </article>

                        <article className="card" aria-labelledby="s3">
                            <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect rx='10' width='64' height='64' fill='%230ea5e9'/><text x='50%' y='55%' font-size='12' fill='%23fff' text-anchor='middle' font-family='Arial'>MDR</text></svg>" alt="MDR icon"/>
                            <h3 id="s3">Managed Detection &amp; Response</h3>
                            <p>24/7 monitoring, rapid containment, and expert triage from our security operations team.</p>
                        </article>
                    </div>
                </section>

                <section id="why" className="why container">
                    <h2>Why ApniSec?</h2>
                    <div className="why-grid">
                        <div>
                            <h4>Expertise</h4>
                            <p>Senior consultants with hands-on experience across finance, healthcare, and SaaS.</p>
                        </div>
                        <div>
                            <h4>Transparent Pricing</h4>
                            <p>Clear scopes and pricing — no surprises. Compliance-ready deliverables.</p>
                        </div>
                        <div>
                            <h4>Actionable Reporting</h4>
                            <p>Reports prioritised by risk and remediation guidance that engineering teams can act on.</p>
                        </div>
                    </div>
                </section>

                <section id="contact" className="contact container">
                    <h2>Get in touch</h2>
                    <p>Ready to reduce risk? Email us at <a href="mailto:contact@apnisec.com">contact@apnisec.com</a> or request a call.</p>
                    <div className="contact-cta">
                        <a href="mailto:contact@apnisec.com" className="btn btn-primary">Email Us</a>
                        <a href="#" className="btn btn-ghost">Request Call</a>
                    </div>
                </section>
            </main>

            <footer className="apnisec-footer">
                <div className="container footer-inner">
                    <div className="footer-brand">
                        <strong>ApniSec</strong>
                        <small>© {new Date().getFullYear()} ApniSec — All rights reserved.</small>
                    </div>
                    <div className="footer-links">
                        <a href="#services">Services</a>
                        <a href="#contact">Contact</a>
                        <a href="/privacy">Privacy</a>
                    </div>
                    <div className="footer-contact">
                        <address>
                            <div>contact@apnisec.com</div>
                            <div>+1 (555) 123-4567</div>
                        </address>
                    </div>
                </div>
            </footer>
        </div>
    )
}