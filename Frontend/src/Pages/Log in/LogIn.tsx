import "./LogIn.css"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from "axios"
import Loader from "../../Components/Loader/Loader"
import { Link } from 'react-router-dom'


export default function LogIn(){
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<{email?:string; password?:string}>({})
    const [status, setStatus] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const validate = () => {
        const e: {email?:string; password?:string} = {}
        const emailRe = /^\S+@\S+\.\S+$/
        if(!emailRe.test(email)) e.email = 'Please enter a valid email address'
        if(password.length < 4) e.password = 'Password must be at least 4 characters'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async(ev: React.FormEvent) => {
        ev.preventDefault()
        setStatus(null)
        if(!validate()) return
        try{
            setIsLoading(true)
            const response = await axios.post('https://apni-sec.onrender.com/api/users/login', { email, password, remember });
            console.log(response)
            if(response.status === 200){
                const token = response.data.token
                if(remember){
                    localStorage.setItem('token_apnisec_remember', token)
                }
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
        <div className="login-page">
            {isLoading && <Loader text="Loading..." />}
            <div className="container">
                <div className="login-card">
                    <header className="login-header">
                        <img src="https://assets.apnisec.com/public/apnisec-ui/logo.svg" alt="ApniSec" className="login-logo" />
                        <h1>Sign in to ApniSec</h1>
                        <p className="muted">Secure access to your security dashboard</p>
                    </header>

                    <form className="login-form" onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" aria-invalid={!!errors.email} />
                            {errors.email && <div className="field-error" role="alert">{errors.email}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-row">
                                <input id="password" type={showPassword? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" aria-invalid={!!errors.password} />
                                <button type="button" className="show-btn" aria-pressed={showPassword} onClick={()=>setShowPassword(s=>!s)}>{showPassword? 'Hide' : 'Show'}</button>
                            </div>
                            {errors.password && <div className="field-error" role="alert">{errors.password}</div>}
                        </div>

                        <div className="form-row remember-row">
                            <label className="remember">
                                <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Remember me
                            </label>
                            <Link to="/" className="forgot">Forgot password?</Link>
                        </div>

                        <div className="form-row">
                            <button className="btn btn-primary full" type="submit">Login</button>
                        </div>

                        {status && <div className="status" role="status">{status}</div>}
                    </form>

                    <div className="signup">
                        <p>New user? <Link to="/register" className="link-underline">Register</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}