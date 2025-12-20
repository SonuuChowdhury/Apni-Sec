import './Register.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [age, setAge] = useState<number | ''>('')
    const [gender, setGender] = useState('')
    const [errors, setErrors] = useState<{name?:string; email?:string; age?:string; gender?:string}>({})
    const [showOTP, setShowOTP] = useState(false)
    const [otp, setOtp] = useState('')
    const [status, setStatus] = useState<string | null>(null)

    const validate = () => {
        const e: {name?:string; email?:string; age?:string; gender?:string} = {}
        const emailRe = /^\S+@\S+\.\S+$/
        if(!name.trim()) e.name = 'Please enter your full name'
        if(!emailRe.test(email)) e.email = 'Please enter a valid email address'
        if(age === '' || Number(age) <= 0) e.age = 'Please enter a valid age'
        if(!gender) e.gender = 'Please select a gender'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    // Called when user clicks Register — keep empty for backend wiring later
    const registerUser = (ev?: React.FormEvent) => {
        if(ev) ev.preventDefault()
        setStatus(null)
        if(!validate()) return
        // Stub: developer will implement registration logic and OTP send
        console.log('Register payload:', { name, email, age, gender })
        // move to OTP state (UI-only for now)
        setShowOTP(true)
    }

    // Called when user clicks Finish up — keep empty for backend wiring later
    const finishRegistration = (ev?: React.FormEvent) => {
        if(ev) ev.preventDefault()
        // Stub: developer will implement OTP verification and finalization
        console.log('Finish registration with OTP:', otp)
        setStatus('OTP submitted (stub). Implement verification logic.')
    }

    return (
        <div className="register-page">
            <div className="container">
                <div className="register-card">
                    <header className="register-header">
                        <img src="https://assets.apnisec.com/public/apnisec-ui/logo.svg" alt="ApniSec" className="register-logo" />
                        <h1>Create your ApniSec account</h1>
                        <p className="muted">Register to access your security dashboard</p>
                    </header>

                    {!showOTP ? (
                    <form className="register-form" onSubmit={registerUser} noValidate>
                        <div className="form-group">
                            <label htmlFor="name">Full name</label>
                            <input id="name" type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" aria-invalid={!!errors.name} required />
                            {errors.name && <div className="field-error" role="alert">{errors.name}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" aria-invalid={!!errors.email} required />
                            {errors.email && <div className="field-error" role="alert">{errors.email}</div>}
                        </div>

                        <div className="form-row two-cols">
                            <div className="form-group">
                                <label htmlFor="age">Age</label>
                                <input id="age" type="number" min={1} value={age} onChange={e=>setAge(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g. 30" aria-invalid={!!errors.age} required />
                                {errors.age && <div className="field-error" role="alert">{errors.age}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select id="gender" value={gender} onChange={e=>setGender(e.target.value)} aria-invalid={!!errors.gender} required>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <div className="field-error" role="alert">{errors.gender}</div>}
                            </div>
                        </div>

                        <div className="form-row">
                            <button className="btn btn-primary full" type="submit">Register</button>
                        </div>
                        {status && <div className="status" role="status">{status}</div>}
                    </form>
                    ) : (
                    <form className="register-form" onSubmit={finishRegistration} noValidate>
                        <div className="form-group">
                            <label htmlFor="otp">Enter OTP</label>
                            <input id="otp" type="text" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="6-digit code" maxLength={8} required />
                        </div>
                        <div className="form-row">
                            <button className="btn btn-primary full" type="submit">Finish up</button>
                        </div>
                        <div className="form-row">
                            <button type="button" className="btn full" onClick={()=>setShowOTP(false)}>Back</button>
                        </div>
                        {status && <div className="status" role="status">{status}</div>}
                    </form>
                    )}

                    <div className="signup">
                        <p>Already registered? <Link to="/login" className="link-underline">Log in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}