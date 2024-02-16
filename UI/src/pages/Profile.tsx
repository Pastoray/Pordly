import { useContext, useEffect, useState } from "react"
import ProfileSidebar from "../components/UI/ProfileSidebar"
import Toolbar from "../components/UI/Toolbar"
import '../styles/pages/Profile.scss'
import { UserContext } from "../context/UserContext"
import { Booster } from "../types/Index"
import { activate_booster, change_bio, delete_access_token, delete_account, fetch_boosters, format_date, validate_form } from "../utils/Index"

type OldCredentials = {
    email: string,
    password: string
}

type NewCredentials = {
    username: string
} & OldCredentials


function Profile() {
    const user = useContext(UserContext)
    const [boosters, setBoosters] = useState<Booster[]>([]);
    
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
                                <textarea spellCheck={false} value={bio} onChange={(e) => setBio(e.target.value)}/>
                            </div>
                            <p id="profile-bio" onClick={() => change_bio(bio)}>Set Bio</p>
                        </div>
                        :
                        category === 2 ?
                            <div className="profile-boosters">
                                {
                                boosters ?
                                    boosters.map((booster, i) => (
                                            <div className='profile-booster' key={i} onClick={() => activate_booster(booster.user_booster_id)}>
                                                <p id='profile-booster-title'>{booster.title}</p>
                                                <p id='profile-booster-info'>{booster.category.toLocaleUpperCase()} &times;{booster.multiplier}</p>
                                                <p id='profile-booster-active'>{booster.isActive ? 'Active' : 'Inactive'}</p>
                                                <p id='profile-booster-date'>{booster.expiration_date ?  format_date(booster.expiration_date) : ''}</p>
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
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            const [e1, e2] = validate_form(oldCredentials, newCredentials)
                                            setErrorMessage1(e1)
                                            setErrorMessage2(e2)
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
                                            if (account_deleted) {
                                                delete_access_token()
                                                window.location.href = 'http://localhost:5173/signup'
                                            } else {
                                                setErrorMessage1("Something went wrong, try again.")
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