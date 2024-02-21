import { useContext, useEffect, useState } from 'react';
import { AchievementsContext } from '../../context/AchievementsContext';
import Toolbar from '../../components/UI/Toolbar';
import { format_date, get_user } from '../../utils/Index';
import '../../styles/pages/Achievements.scss'

function Achievements() {
    const achievements = useContext(AchievementsContext);
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
    return(
        <>  
            {
            userValidated ?
                <div className='achievements-container'>
                    <Toolbar/>
                    <div className='achievements'>
                        {
                        achievements ? achievements.map((achievement, i) => (
                            <div className='achievement' key={i}>
                                <p id='achievement-title'>{achievement.title}</p>
                                <p id='achievement-description'>{achievement.description}</p>
                                {achievement.isComplete ? 
                                    <p style={{color: "hsl(120, 100%, 45%)", textShadow: "0px 0px 5px hsl(120, 100%, 45%)", fontSize: "1.5rem", paddingTop: "0.5rem"}}>Completed on {format_date(achievement.completion_date)}</p>
                                :
                                    <div className='achievement-rewards'>
                                        <p id='achievement-reward-xp'>{achievement.rewards.xp} 🌟</p>
                                        <p id='achievement-reward-gems'>{achievement.rewards.gems} 💎</p>
                                        <p id='achievement-reward-lives'>{achievement.rewards.lives} ❤️</p>
                                    </div>

                                }
                                </div>

                            ))
                        :
                            null
                        }
                    </div>
                </div>
            :
                null
            }
        </>
    ); 
}

export default Achievements;