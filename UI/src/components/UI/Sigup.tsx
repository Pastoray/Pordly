import { useRef, useState, useEffect } from 'react';
import { getUser, createAccount } from '../../utils/Index';
import '../../styles/components/Signup.scss'
function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const usernameErrorRef = useRef<HTMLParagraphElement | null>(null)
    const emailErrorRef = useRef<HTMLParagraphElement | null>(null)
    const passwordErrorRef = useRef<HTMLParagraphElement | null>(null)


    useEffect(() => {
        getUser("accessToken").then((data) => {
            if (data.success) {
                window.location.href = "/"   
            }
        })
    }, [])

    return(
        <>  
            <div className='signup-form-block'>
                <h1>Sign-up</h1>
                <form className='signup-form-container'>
                    <div className='signup-form-input-container'>
                        <input type="name" placeholder='Username' value={username} onChange={(event) => setUsername(event.target.value)}/>
                        <p id='username-error' className='signup-form-error' ref={usernameErrorRef}></p>
                    </div>
                    <div className='signup-form-input-container'>
                        <input type="email" placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)}/>
                        <p id='email-error' className='signup-form-error' ref={emailErrorRef}></p>
                    </div>
                    <div className='signup-form-input-container'>
                        <input type="password" placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)}/>
                        <p id='password-error' className='signup-form-error' ref={passwordErrorRef}></p>
                    </div>
                    <input id='form-submit' type='submit' value='Submit' onClick={(event) => createAccount(event, emailErrorRef, passwordErrorRef, usernameErrorRef, username, email, password)}/>
                </form>
            </div>
        </>
    );
}

export default Signup;