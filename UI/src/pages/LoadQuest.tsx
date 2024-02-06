import { useParams } from 'react-router-dom';
import Game from '../components/Features/Game'
import Toolbar from '../components/UI/Toolbar'
import '../styles/pages/LoadQuest.scss'
import { useContext } from 'react';
import { DailyQuestsContext } from '../context/DailyQuestsContext';
import { UserContext } from '../context/UserContext';
import { QuestType } from '../types/Index';
import LoadingScreen from '../components/UI/LoadingScreen';

type QuestInfo = {
    quest_type: QuestType | undefined,
    quest_id: string
}

function LoadQuest() {
    const user = useContext(UserContext);
    const daily_quests = useContext(DailyQuestsContext);
    const { quest_type, quest_id } = useParams<QuestInfo>();
    const quest = daily_quests?.find((quest) => quest.daily_quest_id === parseInt(quest_id!))!
    return(
        <>  
            {
                daily_quests ?
                    /*user?.stats.lives && user.stats.lives > 0 ?*/
                        <div className='loadgame-container'>
                            <Toolbar/>
                            <Game quest_type={quest_type} quest_id={quest.daily_quest_id}/>
                        </div>
                        /*:
                        <div>
                            <p>YOU DON'T HAVE ENOUGH LIVES</p>
                        </div>*/
                    :
                    <LoadingScreen/>
            }   
            
        </>
    );
}

export default LoadQuest;