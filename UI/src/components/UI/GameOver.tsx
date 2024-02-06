import { useContext, useEffect } from "react";
import { DailyQuestsContext } from "../../context/DailyQuestsContext";
import { useParams } from "react-router-dom";
import { GameOverProps, QuestType } from "../../types/Index";
import { check_quest } from "../../utils/Index";

type QuestInfo = {
    quest_type: QuestType | undefined,
    quest_id: string
}

function GameOver({ accuracy, wpm, time, reset }: GameOverProps) {
    const daily_quests = useContext(DailyQuestsContext);
    const { quest_type, quest_id } = useParams<QuestInfo>();
    const quest = daily_quests?.find((quest) => quest.daily_quest_id === parseInt(quest_id!))!

    const quest_complete = accuracy >= quest.requirements.accuracy && wpm >= quest.requirements.wpm && time >= quest.requirements.time;

    useEffect(() => {
        if (quest_complete) {
            check_quest(parseInt(quest_id!), quest_type)
        }
    }, [])


    return(
        <>
            <div className='mission-finished-container'>
                <p id='mission' className={quest_complete ? "mission-succeeded" : "mission-failed"}>QUEST {quest_complete ? "ACCOMPLISHED" : "FAILED"}</p>
                <div>
                    <p>Total Accuracy: <span className={accuracy >= quest.requirements.accuracy ? `mission-succeeded` : `mission-failed`}>{accuracy.toFixed(2)}%</span></p>
                    <p>Words per minute: <span className={wpm >= quest.requirements.wpm ? `mission-succeeded` : `mission-failed`}>{wpm.toFixed(2)}</span></p>
                    <p>Time left: <span className={time > 0 ? `mission-succeeded` : `mission-failed`}>{time}s</span></p>
                </div>
                <button onClick={() => reset()}>Restart</button>
            </div>
        </>   
    );
}

export default GameOver;