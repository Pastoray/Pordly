import { useState } from 'react';
import Toolbar from '../components/UI/Toolbar';
import '../styles/pages/DailyMission.scss'

function DailyMission() {
    const [status, setStatus] = useState(false);
    return(
        <>  
            <header>
                <Toolbar/>
            </header>
            <main className='daily-mission-menu'>
                <div className='daily-mission' onClick={() => window.location.href = '/dailyMission/1'}>
                    <p id='daily-mission-title'>Daily Mission 1</p>
                    <p>Finish the mission in less then a minute</p>
                    {status ? 
                    <p id='daily-mission-complete'>Complete</p>
                    :
                    <p id='daily-mission-gems'>5💎</p>
                    }
                </div>
                <div className='daily-mission'>
                    <p id='daily-mission-title'>Daily mission 2</p>
                    <p>Get every single word correct </p>
                    {status ? 
                    <p id='daily-mission-complete'>Complete</p>
                    :
                    <p id='daily-mission-gems'>10💎</p>
                    }
                </div>
                <div className='daily-mission'>
                    <p id='daily-mission-title'>Daily mission 3</p>
                    <p>Finish the mission with the randomized word selector</p>
                    {status ? 
                    <p id='daily-mission-complete'>Complete</p>
                    :
                    <p id='daily-mission-gems'>15💎</p>
                    }
                </div>
            </main>
        </>
    );
}

export default DailyMission;