import { useContext } from 'react';
import Toolbar from '../components/UI/Toolbar';
import { DailyQuestsContext } from '../context/DailyQuestsContext';
import { DailyQuests } from '../types/Index';
import LoadingScreen from '../components/UI/LoadingScreen';
import '../styles/pages/DailyQuests.scss'

function DailyQuests() {
    const DailyQuests: DailyQuests | undefined = useContext(DailyQuestsContext);

    return(
        <>  
            <header>
                <Toolbar/>
            </header>
            <main className='daily-quest-menu'>
                {DailyQuests ? 
                    DailyQuests.map((quest, i) => (
                        <div key={i} className='daily-quest' onClick={() => {
                                                                                window.location.href = `daily-quests/${quest.daily_quest_id}`;
                                                                            }}>
                            <p className={`daily-quest-title daily-quest-${quest.difficulty.toLocaleLowerCase()}`}>{quest.title}</p>
                            <p style={{padding: "0rem 0rem 0.25rem", color: "gold", textShadow: "0px 0px 2px gold", fontSize: "1.25rem"}}>Requirements:</p>
                            <div>
                                <p className='daily-quest-requirements'>Accuracy: {quest.requirements.accuracy}%</p>
                                <p className='daily-quest-requirements'>WPM: {quest.requirements.wpm}</p>
                                <p className='daily-quest-requirements'>Time: {`${Math.floor(quest.requirements.time / 60).toString().padStart(2, '0')}:${(quest.requirements.time % 60).toString().padStart(2, '0')}`}</p>
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
