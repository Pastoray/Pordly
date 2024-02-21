import { useEffect, useState } from "react";
import Toolbar from "../../components/UI/Toolbar";
import { fetch_leaderboard_participants, get_user } from "../../utils/Index";
import { User } from "../../types/Index";
import "../../styles/pages/Leaderboards.scss"

function Leaderboards() {
    const [category, setCategory] = useState("streak")
    const [participants, setParticipants] = useState<User[]>([])
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
        async function fetch_leaderboards() {
            const result = await fetch_leaderboard_participants(category)
            setParticipants(result)
        }
        fetch_leaderboards()
    }, [category])

    return(
        <>
            {
            userValidated ?
                <div className='leaderboards-container'>
                    <Toolbar/>
                    <div className='leaderboards-category'>
                        <p id='leaderboards-streak' onClick={() => setCategory("streak")}>🔥 Streak</p>
                        <p id='leaderboards-gems' onClick={() => setCategory("gems")}>💎 Gems</p>
                        <p id='leaderboards-lives' onClick={() => setCategory("xp")}>🌟 XP</p>
                    </div>
                    <div className='leaderboards'>
                        {
                        participants.map((participant, i) => (
                            <div className="leaderboards-participant" key={i} onClick={() => window.location.href = `/profile/${participant.info.user_id}`}>
        
                                <div className="participant-credentials">
                                    <p id="leaderboards-participant-level" style={{color: `${participant.stats.level.color}`, textShadow: `0px 0px 3px ${participant.stats.level.color}`}}>『 {participant.stats.level.level} 』</p>
                                    <div>
                                        <p style={{color: `${participant.stats.level.color}`, textShadow: `0px 0px 3px ${participant.stats.level.color}`}}>{participant.info.username}</p>
                                        <p style={{color: `${participant.stats.title.color}`, textShadow: `0px 0px 3px ${participant.stats.title.color}`, fontSize: "0.75rem" }}>{participant.stats.title.title}</p>
                                    </div>
                                </div>
                                <div className="participant-stats">
                                    <div>
                                        <p id='leaderboards-streak'>{participant.stats.streak}🔥</p>
                                    </div>
                                    <div>
                                        <p id='leaderboards-gems'>{participant.stats.gems}💎</p>
                                    </div>
                                    <div>
                                        <p id='leaderboards-lives'>{participant.stats.xp}🌟</p>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            :
                null
            }
        </>
    );
}

export default Leaderboards;