import { useContext, useEffect, useState } from 'react';
import { DailyQuestsContext } from '../../context/DailyQuestsContext';
import Toolbar from '../../components/UI/Toolbar';
import Loading from '../../components/UI/Loading';
import { get_user } from '../../utils/Index';
import { DailyQuest } from '../../types/Index';
import '../../styles/pages/DailyQuests.scss'

function DailyQuests() {
    const DailyQuests: DailyQuest[] | undefined = useContext(DailyQuestsContext);
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
                                <Loading/>
                            }
                        </main>
                    </>
                :
                    null
                }
            </>
        );
    }
    export default DailyQuests;
