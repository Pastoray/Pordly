import { useContext } from 'react';
import Toolbar from '../components/UI/Toolbar';
import '../styles/pages/DailyQuests.scss'
import { DailyQuestsContext } from '../context/DailyQuestsContext';
import { DailyQuests, User } from '../types/Index';
import LoadingScreen from '../components/UI/LoadingScreen';
import { decrement_lives } from '../utils/Index';
import { UserContext } from '../context/UserContext';

function DailyQuests() {
    const User: User | undefined = useContext(UserContext)
    const DailyQuests: DailyQuests | undefined = useContext(DailyQuestsContext);
    return(
        <>  
            <header>
                <Toolbar/>
            </header>
            <main className='daily-quest-menu'>
                {DailyQuests ? 
                    DailyQuests.map((quest, i) => (
                        <div key={i} className='daily-quest' onClick={async () => {
                                                                                if (User!.stats.lives > 0) {
                                                                                    if (!quest.isComplete) await decrement_lives();
                                                                                    window.location.href = `daily-quests/${quest.daily_quest_id}`;
                                                                                }
                                                                            }}>
                            <p className={`daily-quest-title daily-quest-${quest.difficulty.toLocaleLowerCase()}`}>{quest.title}</p>
                            <p style={{padding: "0rem 0rem 0.25rem", color: "gold", textShadow: "0px 0px 2px gold"}}>Requirements:</p>
                            <div>
                                <p className='daily-quest-requirements'>{quest.requirements.accuracy}% Accuracy</p>
                                <p className='daily-quest-requirements'>{quest.requirements.wpm} WPM</p>
                                <p className='daily-quest-requirements'>{quest.requirements.time} Seconds</p>
                            </div>
                                <p className={`daily-quest-${quest.difficulty.toLocaleLowerCase()}`}>{quest.difficulty}</p>
                            {
                            quest.isComplete ? 
 
                                <p className='daily-quest-complete'>Completed</p>
                            :
                                <div className='daily-quest-reward-container'>
                                    <p className='daily-quest-xp'>{quest.reward.xp}🌟</p>
                                    <p className='daily-quest-gems'>{quest.reward.gems}💎</p>
                                    {quest.reward.lives == 0 ?
                                        null
                                        :
                                        <p className='daily-quest-lives'>{quest.reward.lives}❤️</p>
                                    }
                                </div>

                            }
                        </div>
                    ))
                :
                <LoadingScreen/>
                }
            </main>
        </>
    );
}
export default DailyQuests;
