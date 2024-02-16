import { useRef, useState } from 'react'
import { checkForAccount } from '../../utils/Index';
import '../../styles/components/Login.scss'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailErrorRef = useRef<HTMLParagraphElement | null>(null);
    const passwordErrorRef = useRef<HTMLParagraphElement | null>(null);

    return(
        <>  
            <div className='login-form-body'>
                <div className='login-form-block'>
                    <h1>Login</h1>
                    <form className='login-form-container'>
                        <div className='login-form-input-container'>
                            <input type="email" placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)}/>
                            <p id='email-error' className='login-form-error' ref={emailErrorRef}></p>
                        </div>
                        <div className='login-form-input-container'>
                            <input type="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)}/>
                            <p id='password-error' className='login-form-error' ref={passwordErrorRef}></p>
                        </div>
                        <input type='submit' value='Submit' onClick={(event) => checkForAccount(event, emailErrorRef, passwordErrorRef, email, password)}/>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;