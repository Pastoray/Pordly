import { useContext, useEffect, useState } from "react"
import ProfileSidebar from "../components/UI/ProfileSidebar"
import Toolbar from "../components/UI/Toolbar"
import '../styles/pages/Profile.scss'
import { UserContext } from "../context/UserContext"
import { Booster } from "../types/Index"
import { fetch_boosters } from "../utils/Index"

function Profile() {
    const user = useContext(UserContext)
    const [boosters, setBoosters] = useState<Booster[]>([]);
    useEffect(() => {
        async function get_boosters() {
            const boosters = await fetch_boosters()
            setBoosters(boosters)
        }
        get_boosters()
    }, [])
    return (
        <>
            <div className="profile-container">
                <Toolbar/>
                <div className="profile-page">
                    <ProfileSidebar/>
                    {/*<div className="profile">
                        <div className="profile-header">
                            <p style={{color: `${user?.stats.level.color}`, textShadow: `0px 0px 3px ${user?.stats.level.color}`}} id="profile-username">{user?.info.username}</p>
                            <p style={{color: `${user?.stats.level.color}`, textShadow: `0px 0px 3px ${user?.stats.title.color}`}} id="profile-title">{user?.stats.title.title}</p>
                        </div>
                        <p id="profile-bio">BIO</p>
                        <div className="profile-bio">
                            <textarea spellCheck={false}>

                            </textarea>
                        </div>
                    </div>*/}
                    
                    <div className="profile-boosters">
                        {
                        boosters ?
                            boosters.map((booster, i) => (
                                    <div className='profile-booster' key={i}>
                                        <p id='profile-booster-info'>{booster.category.toLocaleUpperCase()} &times;{booster.multiplier}</p>
                                        <p id='profile-booster-active'>{booster.isActive ? 'Active' : 'Inactive'}</p>
                                        <p id='profile-booster-date'>{booster.expiration_date ?  booster.expiration_date : 'cock'}</p>
                                    </div>
                                )
                            )
                        :
                            null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile