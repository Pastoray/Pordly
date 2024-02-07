import { useParams } from 'react-router-dom';
import Game from '../components/Features/Game'
import Toolbar from '../components/UI/Toolbar'
import '../styles/pages/LoadQuest.scss'
import { useContext, useEffect } from 'react';
import { DailyQuestsContext } from '../context/DailyQuestsContext';
import { UserContext } from '../context/UserContext';
import { QuestType } from '../types/Index';
import LoadingScreen from '../components/UI/LoadingScreen';
import { decrement_lives } from '../utils/Index';

type QuestInfo = {
    quest_type: QuestType | undefined,
    quest_id: string
}

function LoadQuest() {
    const user = useContext(UserContext);
    const daily_quests = useContext(DailyQuestsContext);
    const { quest_type, quest_id } = useParams<QuestInfo>();
    const quest = daily_quests?.find((quest) => quest.daily_quest_id === parseInt(quest_id!))!

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
                daily_quests && user ?
                    user.stats.lives > 0 ?
                        <div className='loadgame-container'>
                            <Toolbar/>
                            <Game quest_type={quest_type} quest_id={quest.daily_quest_id}/>
                        </div>
                    :   
                        <div className='loadgame-not-enough-lives'>
                            <Toolbar/>
                            <p id='not-enough-lives'>NOT ENOUGH LIVES</p>
                        </div>
                :
                    <LoadingScreen/>
            }   
            
        </>
    );
}

export default LoadQuest;