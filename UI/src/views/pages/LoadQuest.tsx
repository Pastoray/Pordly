import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StoryQuestsContext } from '../../context/StoryQuestsContext';
import { DailyQuestsContext } from '../../context/DailyQuestsContext';
import { UserContext } from '../../context/UserContext';
import Game from '../../components/Features/Game'
import Toolbar from '../../components/UI/Toolbar'
import Loading from '../../components/UI/Loading';
import { decrement_lives, get_user } from '../../utils/Index';
import { QuestType } from '../../types/Index';
import '../../styles/pages/LoadQuest.scss'

type QuestInfo = {
    quest_type: QuestType | undefined,
    quest_id: string
}

function LoadQuest() {
    const user = useContext(UserContext);
    const { quest_type, quest_id } = useParams<QuestInfo>();
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

    let quests;
    let q_id;
    if (quest_type == "daily-quests") {
        quests = useContext(DailyQuestsContext);
        const quest = quests?.find((quest) => quest.daily_quest_id === parseInt(quest_id!))!
        q_id = quest?.daily_quest_id
    } else {
        quests = useContext(StoryQuestsContext);
        const quest = quests?.find((quest) => quest.story_quest_id === parseInt(quest_id!))!
        q_id = quest?.story_quest_id
    }

    

    useEffect(() => {
        if (user) {
            if (user.stats.lives > 0) {
                decrement_lives();
            }
        }
    }, [user])

    return(
        <>  
            {
            userValidated ?
                <>
                    {
                        quests && user && q_id ?
                            user.stats.lives > 0 ?
                                <div className='loadgame-container'>
                                    <Toolbar/>
                                    <Game quest_type={quest_type} quest_id={q_id}/>
                                </div>
                            :   
                                <div className='loadgame-not-enough-lives'>
                                    <Toolbar/>
                                    <p id='not-enough-lives'>NOT ENOUGH LIVES</p>
                                </div>
                        : <div className='loadgame-loading-screen'>
                                <Loading/>
                            </div>
                    }
                </>   
            :
                null
            }
        </>
    );
}

export default LoadQuest;