import { useState } from 'react';
import Toolbar from '../components/UI/Toolbar';
import '../styles/pages/DailyQuests.scss'

function DailyQuest() {
    const [status, setStatus] = useState(false);
    return(
        <>  
            <header>
                <Toolbar/>
            </header>
            <main className='daily-mission-menu'>
                <div className='daily-mission' onClick={() => window.location.href = '/dailyquests/1'}>
                    <p id='daily-mission-title'>Daily Mission 1</p>
                    <p>Finish the mission in less then 2:00 minutes with at least 20% accuracy and 10 WPM</p>
                    <p id='daily-mission-easy'>Easy</p>
                    {status ? 
                    <p id='daily-mission-complete'>Complete</p>
                    :
                    <p id='daily-mission-gems'>10💎</p>
                    }
                </div>
                <div className='daily-mission' onClick={() => window.location.href = '/dailyquests/2'}>
                    <p id='daily-mission-title'>Daily mission 2</p>
                    <p>Finish the mission in less then 1:15 minutes with at least 40% accuracy and 15 WPM</p>
                    <p id='daily-mission-medium'>Medium</p>
                    {status ? 
                    <p id='daily-mission-complete'>Complete</p>
                    :
                    <p id='daily-mission-gems'>25💎</p>
                    }
                </div>
                <div className='daily-mission' onClick={() => window.location.href = '/dailyquests/3'}>
                    <p id='daily-mission-title'>Daily mission 3</p>
                    <p>Finish the mission in less then 0:30 seconds with at least 60% accuracy and 20 WPM</p>
                    <p id='daily-mission-hard'>Hard</p>
                    {status ? 
                    <p id='daily-mission-complete'>Complete</p>
                    :
                    <p id='daily-mission-gems'>40💎</p>
                    }
                </div>
            </main>
        </>
    );
}

export default DailyQuest;