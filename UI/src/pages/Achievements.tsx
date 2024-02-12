import { useContext, useEffect, useState } from 'react';
import Toolbar from '../components/UI/Toolbar';
import { Achievement, Achievements } from '../types/Index';
import '../styles/pages/Achievements.scss'
import { fetchUserAchievements } from '../utils/Index';
import { UserContext } from '../context/UserContext';

function Achievements() {
    const User = useContext(UserContext);
    const [achievements, setAchievements] = useState<Achievements>([])
    useEffect(() => {
        if (User) {
            fetchUserAchievements(User.info.id, setAchievements)
        }
    }, [User])
    function format_date(quest: Achievement) {
        const completionDate = new Date(quest.completion_date);
        const formattedDate = `${completionDate.getFullYear()}-${(completionDate.getMonth() + 1).toString().padStart(2, '0')}-${completionDate.getDate().toString().padStart(2, '0')}`;
        return formattedDate
    }
    return(
        <>
            <div className='achievements-container'>
                <Toolbar/>
                <div className='achievements'>
                    {achievements.map((achievement, i) => (
                        <div className='achievement' key={i}>
                            <p id='achievement-title'>{achievement.title}</p>
                            <p id='achievement-description'>{achievement.description}</p>
                            {achievement.isComplete ? 
                                <p style={{color: "hsl(120, 100%, 45%)", textShadow: "0px 0px 5px hsl(120, 100%, 45%)", fontSize: "1.5rem", paddingTop: "0.5rem"}}>Completed on {format_date(achievement)}</p>
                            :
                                <div className='achievement-rewards'>
                                    <p id='achievement-reward-xp'>{achievement.rewards.xp} 🌟</p>
                                    <p id='achievement-reward-gems'>{achievement.rewards.gems} 💎</p>
                                    <p id='achievement-reward-lives'>{achievement.rewards.lives} ❤️</p>
                                </div>

                            }
                            </div>

                    ))}
                </div>
            </div>
        </>
    ); 
}

export default Achievements;