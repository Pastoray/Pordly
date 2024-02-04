import { useParams } from 'react-router-dom';
import Game from '../components/Features/Game'
import Toolbar from '../components/UI/Toolbar'
import '../styles/pages/LoadQuest.scss'
import { useContext } from 'react';
import { DailyQuestsContext } from '../context/DailyQuestsContext';

function LoadQuest() {
    const daily_quests = useContext(DailyQuestsContext);
    const { quest_type, quest_id } = useParams();
    const quest = daily_quests?.find((quest) => quest.daily_quest_id === parseInt(quest_id!))!
    return(
        <>  
            {
                daily_quests ?
                <div className='loadgame-container'>
                    <Toolbar/>
                    <Game quest_type={quest_type} quest_id={quest.daily_quest_id}/>
                </div>
                :
                null
            }   
            
        </>
    );
}

export default LoadQuest;