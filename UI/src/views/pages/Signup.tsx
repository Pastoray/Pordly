import { useRef, useState, useEffect } from 'react';
import { get_user, create_account } from '../../utils/Index';
import '../../styles/components/Signup.scss'
function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const usernameErrorRef = useRef<HTMLParagraphElement | null>(null)
    const emailErrorRef = useRef<HTMLParagraphElement | null>(null)
    const passwordErrorRef = useRef<HTMLParagraphElement | null>(null)


    useEffect(() => {
        async function redirect_user() {
            const data = await get_user()
            if (data) {
                window.location.href = "/"   
            }
        }
        redirect_user()
    }, [])

    return(
        <>  
            <div className='signup-form-body'>
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
                        <a id='signup-form-have-account' href='/login'>Already have an account ?</a>
                        <input id='form-submit' type='submit' value='Submit' onClick={(event) => create_account(event, emailErrorRef, passwordErrorRef, usernameErrorRef, username, email, password)}/>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Signup;