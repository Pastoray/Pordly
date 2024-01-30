import Game from '../components/Features/Game'
import Toolbar from '../components/UI/Toolbar'
import NoPage from './NoPage';
import { LoadQuestProps } from '../types/Index';
import { useParams } from 'react-router-dom';
import '../styles/pages/LoadQuest.scss'



function LoadQuest({ questType }: LoadQuestProps) {
    const { mission } = useParams()
    const level = parseInt(mission!);
    let requirements;

    const isDailyQuest = questType == 'daily';
    if ((isDailyQuest && level > 3) || level > 50 || level < 1) return <NoPage/>;

    if (isDailyQuest) {
        if (level == 1) {
            requirements = { wpm: 10, accuracy: 20, time: 120 }
        } else if (level == 2) {
            requirements = { wpm: 15, accuracy: 40, time: 75 }
        } else {
            requirements = { wpm: 20, accuracy: 60, time: 30 }
        }
    }
    
    const addTimer = isDailyQuest || level > 10;
    return(
        <>  
            {
            <div className='loadgame-container'>
                <Toolbar/>
                <Game questType={isDailyQuest ? 'daily' : 'story'} mission={level} sentences={isDailyQuest ? 50 : level * 2} timer={addTimer}
                      reqTime={isDailyQuest ? requirements!.time : 775 - (level / 2) * 30}
                      reqWpm={isDailyQuest ? requirements!.wpm : level > 30 ? level : level * 2}
                      reqAccuracy={isDailyQuest ? requirements!.accuracy : level > 30 ? level : level * 2}/>
            </div>
            }

        </>
    );
}

export default LoadQuest;