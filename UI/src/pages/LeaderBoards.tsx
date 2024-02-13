import { useEffect, useState } from "react";
import Toolbar from "../components/UI/Toolbar";
import "../styles/pages/LeaderBoards.scss"
import { fetchLeaderboardParticipants } from "../utils/Index";
import { User } from "../types/Index";

function Leaderboards() {
    const [participants, setParticipants] = useState<User[]>([])
    useEffect(() => {
        fetchLeaderboardParticipants("streak", setParticipants)
    }, [])

    return(
        <>
            <div className='leaderboards-container'>
                <Toolbar/>
                <div className='leaderboards-category'>
                    <p id='leaderboards-streak' onClick={() => fetchLeaderboardParticipants("streak", setParticipants)}>🔥 Streak</p>
                    <p id='leaderboards-gems' onClick={() => fetchLeaderboardParticipants("gems", setParticipants)}>💎 Gems</p>
                    <p id='leaderboards-lives' onClick={() => fetchLeaderboardParticipants("xp", setParticipants)}>🌟 XP</p>
                </div>
                <div className='leaderboards'>
                    {participants.map((participant, i) => (
                        <div className="leaderboards-participant" key={i}>
    
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
        </>
    );
}

export default Leaderboards;