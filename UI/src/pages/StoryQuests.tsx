import { useContext } from 'react';
import Toolbar from '../components/UI/Toolbar';
import { StoryQuestsContext } from '../context/StoryQuestsContext';
import { StoryQuest, StoryQuests } from '../types/Index';
import LoadingScreen from '../components/UI/LoadingScreen';
import '../styles/pages/StoryQuests.scss'

function StoryQuests() {
    const StoryQuests: StoryQuests | undefined = useContext(StoryQuestsContext);
    function format_date(quest: StoryQuest) {
        const completionDate = new Date(quest.completion_date);
        const formattedDate = `${completionDate.getFullYear()}-${(completionDate.getMonth() + 1).toString().padStart(2, '0')}-${completionDate.getDate().toString().padStart(2, '0')}`;
        return formattedDate
    }
    return( 
        <>  
            <header>
                <Toolbar/>
            </header>
            <main className='story-quest-menu'>
                <div className='story-quests'>
                    {StoryQuests ? 
                        StoryQuests.map((quest, i) => (
                            <div key={i} className='story-quest' onClick={() => {
                                                                                    window.location.href = `story-quests/${quest.story_quest_id}`;
                                                                                }}>
                                <p className={`story-quest-title story-quest-${quest.difficulty.toLocaleLowerCase()}`}>{quest.title}</p>
                                <p style={{padding: "0rem 0rem 0rem 3rem", color: "gold", textShadow: "0px 0px 2px gold", fontSize: "1.25rem"}}>Requirements:</p>
                                <div className='story-quest-requirements'>
                                    <p id='story-quest-requirements'>Accuracy: {quest.requirements.accuracy}%</p>
                                    <p id='story-quest-requirements'>WPM: {quest.requirements.wpm}</p>
                                    <p id='story-quest-requirements'>Time: {`${Math.floor(quest.requirements.time / 60).toString().padStart(2, '0')}:${(quest.requirements.time % 60).toString().padStart(2, '0')}`}</p>
                                </div>
                                {
                                quest.isComplete ? 
    
                                    <p className='story-quest-complete'>Completed on {format_date(quest)}</p>
                                :
                                    <div className='story-quest-reward-container'>
                                        <p className='story-quest-xp'>{quest.reward.xp}🌟</p>
                                        <p className='story-quest-gems'>{quest.reward.gems}💎</p>
                                        {quest.reward.lives == 0 ?
                                            null
                                            :
                                            <p className='story-quest-lives'>{quest.reward.lives}❤️</p>
                                        }
                                    </div>

                                }
                            </div>
                        ))
                    :
                    <div className='story-quest-loading-screen'>
                        <LoadingScreen/>
                    </div>
                    }
                </div>
            </main>
        </>
    );
}
export default StoryQuests;