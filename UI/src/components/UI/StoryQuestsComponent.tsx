import { useContext } from 'react';
import '../../styles/components/StoryQuestsComponent.scss'
import { StoryQuestsContext } from '../../context/StoryQuestsContext';

function StoryQuestsComponent() {
    const StoryQuests = useContext(StoryQuestsContext)
    return(
        <div className="story-quests-component-container">
            <p>Story Quests</p>
            <div className='story-quests-component-quests'>
                {StoryQuests ? StoryQuests.map((quest, i) => (
                        <div key={i} className={`story-quest-component-quest`} onClick={() => {
                            window.location.href = `story-quests/${quest.story_quest_id}`;
                        }}>
                            <p className={`story-quest-component-title story-quest-component-${quest.difficulty.toLowerCase()}`}>{quest.title}</p>
                            <p className={`story-quest-component-checkmark`}>{quest.isComplete ? '✔' : ''}</p>
                        </div>
                    ))
                :
                    null
                }
            </div>
        </div>
    );
}

export default StoryQuestsComponent;