import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Toolbar from "../../components/UI/Toolbar"
import Loading from "../../components/UI/Loading";
import { get_user, get_user_by_id } from "../../utils/Index";
import { User, CompletionProgress } from "../../types/Index";
import Card from "../../components/UI/Card";
import '../../styles/pages/UserProfile.scss'

function UserProfile() {
    const { user_id } = useParams()
    const [user, setUser] = useState<User>()
    const [completionProgress, setCompletionProgress] = useState({
        story_quests_complete: 0,
        daily_quest_complete: 0,
        achivements_complete: 0
    } as CompletionProgress)
    const [userValidated, setUserValidated] = useState(false);

    useEffect(() => {
        async function user_exists() {
            const result = await get_user()
            if (result === undefined) {
                window.location.href = '/login'
            } else {
                setUserValidated(true)
            }
        }
        user_exists()
    })

    useEffect(() => {
        async function fetch_user() {
            if (user_id) {
                const { user, story_quests_complete, daily_quests_complete, achievements_complete } = await get_user_by_id(parseInt(user_id))
                setUser(user)
                setCompletionProgress((prev) => ({
                    ...prev,
                    story_quests_complete: story_quests_complete,
                    daily_quest_complete: daily_quests_complete,
                    achivements_complete: achievements_complete
                }))
            }
        }
        fetch_user()
    }, [])

    return (
        <>
            {
            userValidated ?
                <div className="user-profile-container">
                    <Toolbar/>
                    {
                    user ?
                        <div className="user-profile-content">
                            <div className="user-profile-info">
                                <p id="user-profile-username" style={{color: `${user.stats.level.color}`, textShadow: `0px 0px 5px ${user.stats.level.color}`}}>{user.info.username}</p>
                                <p id="user-profile-title" style={{color: `${user.stats.title.color}`, textShadow: `0px 0px 5px ${user.stats.title.color}`}}>{user.stats.title.title}</p>
                            </div>
                            <div className="user-profile-bio">
                                <p id="user-profile-bio">{user.info.bio}</p>
                            </div>
                            <p id="user-profile-bio-litteral">BIO</p>
                            <div className="user-profile-stats">
                                <p id="user-profile-streak">{user.stats.streak}🔥</p>
                                <p id="user-profile-gems">{user.stats.gems}💎</p>
                                <p id="user-profile-lives">{user.stats.lives}❤️</p>
                            </div>
                            <div className="user-profile-cards">
                                <Card title={'Daily Quests'} doneCount={completionProgress.daily_quest_complete} totalCount={3}/>
                                <Card title={'Story Quests'} doneCount={completionProgress.story_quests_complete} totalCount={20}/>
                                <Card title={'Achivements'} doneCount={completionProgress.achivements_complete} totalCount={10}/>
                            </div>
                        </div>
                    :
                        <Loading/>
                    }
                </div>
            :
                null
            }
        </>
    )
}

export default UserProfile