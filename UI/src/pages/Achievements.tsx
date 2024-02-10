import { useContext, useEffect, useState } from 'react';
import Toolbar from '../components/UI/Toolbar';
import { Achievements } from '../types/Index';
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
    return(
        <>
            <div className='achievements-container'>
                <Toolbar/>
                <div className='achievements'>
                    {achievements.map((achievement, i) => (
                        <div className='achievement' key={i}>
                            <p id='achievement-title'>{achievement.title}</p>
                            <p id='achievement-description'>{achievement.description}</p>
                            <div className='achievement-rewards'>
                                <p id='achievement-reward-xp'>{achievement.rewards.xp} 🌟</p>
                                <p id='achievement-reward-gems'>{achievement.rewards.gems} 💎</p>
                                <p id='achievement-reward-lives'>{achievement.rewards.lives} ❤️</p>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </>
    ); 
}

export default Achievements;