import { useContext, useEffect } from "react";
import { DailyQuestsContext } from "../../context/DailyQuestsContext";
import { useParams } from "react-router-dom";
import { GameOverProps, QuestType } from "../../types/Index";
import { check_quest, check_achievement } from "../../utils/Index";
import { StoryQuestsContext } from "../../context/StoryQuestsContext";

type QuestInfo = {
    quest_type: QuestType | undefined,
    quest_id: string
}

function GameOver({ accuracy, wpm, time, reset }: GameOverProps) {
    const { quest_type, quest_id } = useParams<QuestInfo>();
    
    const quests = quest_type == "daily-quests" ? useContext(DailyQuestsContext) : useContext(StoryQuestsContext);
    const quest = quests!.filter((quest) => quest_id == (quest_type == "daily-quests" ? quest.daily_quest_id : quest.story_quest_id))[0];
    
    const quest_complete = accuracy >= quest.requirements.accuracy && Math.ceil(wpm) >= quest.requirements.wpm && time > 0;
    const accuracy_achievement_finished = accuracy >= 95
    const wpm_achievement_finished = wpm >= 100


    useEffect(() => {
        if (quest_complete) {
            check_quest(parseInt(quest_id!), quest_type)
        }

        if (accuracy_achievement_finished) {
            check_achievement(5)
        }

        if (wpm_achievement_finished) {
            check_achievement(4)
        }
    }, [])


    return(
        <>
            <div className='mission-finished-container'>
                <p id='mission' className={quest_complete ? "mission-succeeded" : "mission-failed"}>QUEST {quest_complete ? "ACCOMPLISHED" : "FAILED"}</p>
                <div className="mission-results">
                    <p>Total Accuracy → <span className={accuracy >= quest.requirements.accuracy ? `mission-succeeded` : `mission-failed`}>{accuracy.toFixed(2)}%</span></p>
                    <p>Words per minute → <span className={wpm >= quest.requirements.wpm ? `mission-succeeded` : `mission-failed`}>{Math.ceil(wpm)}</span></p>
                    <p>Time left → <span className={time > 0 ? `mission-succeeded` : `mission-failed`}>{`${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`}</span></p>
                </div>
                <button onClick={() => reset()}>Restart</button>
            </div>
        </>   
    );
}

export default GameOver;