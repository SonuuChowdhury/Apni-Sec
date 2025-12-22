import './Register.css'
import { useState } from 'react'
import axios, { AxiosError } from "axios"
import { Link } from 'react-router-dom'
import Loader from '../../Components/Loader/Loader'
import { useNavigate } from 'react-router-dom'

export default function Register(){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [age, setAge] = useState<number | ''>('')
    const [gender, setGender] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{name?:string; email?:string; password?:string; age?:string; gender?:string}>({})
    const [status, setStatus] = useState<string | null>(null)

    // eslint-disable-next-line
const validate = () => {
        const e: {name?:string; email?:string; password?:string; age?:string; gender?:string} = {}
        const emailRe = /^\S+@\S+\.\S+$/
        if(!name.trim()) e.name = 'Please enter your full name'
        if(!emailRe.test(email)) e.email = 'Please enter a valid email address'
        if(!password || password.length < 4) e.password = 'Password must be at least 4 characters'
        if(age === '' || Number(age) <= 0) e.age = 'Please enter a valid age'
        if(!gender) e.gender = 'Please select a gender'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    // Called when user clicks Register — keep empty for backend wiring later
    const registerUser = async (ev?: React.FormEvent) => {
        if(ev) ev.preventDefault()
            if(!validate()) return
            try{
                setIsLoading(true)
                const response = await axios.post('https://apni-sec.onrender.com/api/users/register', { name, email,password, age, gender })
                if(response.status === 201){
                    const token = response.data.token
                    localStorage.setItem('token_apnisec', token)
                    navigate(`/dashboard/${token}`)
                }else{
                    alert(response.data.error)
                }
            }catch(error){
                if(error instanceof AxiosError){
                    alert(error.response?.data.error)
                }else{
                    alert('An error occurred. Please try again.')
                }
            }finally{
                setIsLoading(false)
            }

    }


    return (
        <div className="register-page">
            {isLoading && <Loader text="Loading..." />}
            <div className="container">
                <div className="register-card">
                    <header className="register-header">
                        <img src="https://assets.apnisec.com/public/apnisec-ui/logo.svg" alt="ApniSec" className="register-logo" />
                        <h1>Create your ApniSec account</h1>
                        <p className="muted">Register to access your security dashboard</p>
                    </header>

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
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" aria-invalid={!!errors.password} required minLength={6} />
                            {errors.password && <div className="field-error" role="alert">{errors.password}</div>}
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

                    <div className="signup">
                        <p>Already registered? <Link to="/login" className="link-underline">Log in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
