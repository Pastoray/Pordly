import { useContext, useEffect, useState } from "react"
import ProfileSidebar from "../components/UI/ProfileSidebar"
import Toolbar from "../components/UI/Toolbar"
import '../styles/pages/Profile.scss'
import { UserContext } from "../context/UserContext"
import { OldCredentials, NewCredentials, UserBooster } from "../types/Index"
import { activate_booster, change_bio, change_credentials, delete_access_token, delete_account, fetch_boosters, format_date, validate_form } from "../utils/Index"


function Profile() {
    const user = useContext(UserContext)
    const [boosters, setBoosters] = useState<UserBooster[]>([]);
    
    const [category, setCategory] = useState(1);
    
    const [bio, setBio] = useState('');

    const [errorMessage1, setErrorMessage1] = useState('');    
    const [errorMessage2, setErrorMessage2] = useState('');

    const [oldCredentials, setOldCredentials] = useState<OldCredentials>({ email: "", password: ""} as OldCredentials);
    const [newCredentials, setNewCredentials] = useState<NewCredentials>({ username: "", email: "", password: ""} as NewCredentials);
    
    useEffect(() => {
        async function get_boosters() {
            const boosters = await fetch_boosters()
            setBoosters(boosters)
            console.log(boosters)
        }
        get_boosters()
    }, [])

    useEffect(() => {
        setBio(user?.info.bio || '')
    }, [user])
    return (
        <>
            <div className="profile-container">
                <Toolbar/>
                <div className="profile-page">
                    <ProfileSidebar setCategory={setCategory}/>
                    {
                        category === 1 ?
                            <div className="profile">
                            <div className="profile-header">
                                <p style={{color: `${user?.stats.level.color}`, textShadow: `0px 0px 3px ${user?.stats.level.color}`}} id="profile-username">{user?.info.username}</p>
                                <p style={{color: `${user?.stats.level.color}`, textShadow: `0px 0px 3px ${user?.stats.title.color}`}} id="profile-title">{user?.stats.title.title}</p>
                            </div>
                            <div className="profile-bio">
                                <textarea spellCheck={false} value={bio} maxLength={120} onChange={(e) => setBio(e.target.value)}/>
                            </div>
                            <p id="profile-bio" onClick={() => change_bio(bio)}>Set Bio</p>
                        </div>
                        :
                        category === 2 ?
                            <div className="profile-boosters">
                                {
                                boosters ?
                                    boosters.map((booster, i) => (
                                            <div className='profile-booster' key={i} style={{border: `3px solid ${booster.color}`}} onClick={() => activate_booster(booster.user_booster_id)}>
                                                <p id='profile-booster-title' style={{color: booster.color}}>{booster.title}</p>
                                                <p id='profile-booster-info'>{booster.category.toLocaleUpperCase()} &times;{booster.multiplier}</p>
                                                <p id='profile-booster-active' style={{color: booster.isActive ? 'hsl(120, 100%, 50%)' : 'hsl(40, 100%, 50%)', textShadow: booster.isActive ? '0px 0px 3px hsl(120, 100%, 50%)' : '0px 0px 3px hsl(40, 100%, 50%)'}}>{booster.isActive ? 'Active' : 'Inactive'}</p>
                                                <p id='profile-booster-date' style={{color: "hsl(120, 100%, 50%)", textShadow: "0px 0px 3px hsl(120, 100%, 50%)"}}>{booster.expiration_date ?  format_date(booster.expiration_date) : ''}</p>
                                            </div>
                                        )
                                    )
                                :
                                    null
                                }
                            </div>
                        :
                            <div className="profile-account-container">
                                <div className="profile-account-forms-container">
                                    <form className="profile-account-form-1">
                                        <input id="profile-account-email" placeholder=" Old Email" onChange={(e) => setOldCredentials((prev) => ({...prev, email: e.target.value}))}/>
                                        <input id="profile-account-password" type="password" placeholder="Old Password" onChange={(e) => setOldCredentials((prev) => ({...prev!, password: e.target.value}))}/>
                                        <p id="profile-account-error-message-1">{errorMessage1}</p>
                                    </form>
                                    <form className="profile-account-form-2">
                                        <input id="profile-account-new-username" placeholder="New Username" onChange={(e) => setNewCredentials((prev) => ({...prev, username: e.target.value}))}/>
                                        <input id="profile-account-new-email" placeholder="New Email" onChange={(e) => setNewCredentials((prev) => ({...prev, email: e.target.value}))}/>
                                        <input id="profile-account-new-password" type="password" placeholder="New Password" onChange={(e) => setNewCredentials((prev) => ({...prev!, password: e.target.value}))}/>
                                        <button onClick={async (e) => {
                                            e.preventDefault();
                                            const [e1, e2] = validate_form(oldCredentials, newCredentials)
                                            setErrorMessage1(e1)
                                            setErrorMessage2(e2)
                                            if (!e1 && !e2) {
                                                const credentials_changed = await change_credentials(oldCredentials, newCredentials)
                                                if (credentials_changed.success) {
                                                    window.location.reload()
                                                } else {
                                                    setErrorMessage1("")
                                                    setErrorMessage2(credentials_changed.error)
                                                }
                                            }
                                        }}>Submit</button>
                                        <p id="profile-account-error-message-2">{errorMessage2}</p>
                                    </form>
                                </div>
                                <div className="profile-account-delete-button-container">
                                    <button id="profile-account-delete-button" onClick={async (e) => {
                                        e.preventDefault();
                                        const [e1, _] = validate_form(oldCredentials, newCredentials)
                                        setErrorMessage2("")
                                        if (e1){
                                            setErrorMessage1(e1)
                                        } else {
                                            const account_deleted = await delete_account(oldCredentials)
                                            if (account_deleted.success) {
                                                delete_access_token()
                                                window.location.href = 'http://localhost:5173/signup'
                                            } else {
                                                setErrorMessage1(account_deleted.error)
                                            }
                                        }
                                    }}>Delete Account</button>
                                </div>
                            </div>
                    }

                </div>
            </div>
        </>
    )
}

export default Profile