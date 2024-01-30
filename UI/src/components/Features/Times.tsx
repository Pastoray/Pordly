import { TimerProps } from '../../types/Index';
import { useEffect, useState } from 'react';
import '../../styles/components/Timer.scss'

function Timer({ time }: TimerProps) {
    const [formatedTime, setFormatedTime] = useState(`${Math.floor(time / 60).toString().padStart(2, '0')}
                                                     :${(time % 60).toString().padStart(2, '0')}`)                              
    
    useEffect(() => {
        const minutes = (Math.floor(time / 60)).toString().padStart(2, '0')
        const seconds = (time % 60).toString().padStart(2, '0')
        const formattedTime = `${minutes}:${seconds}`
        setFormatedTime(formattedTime);
    }, [time]);

    return(
        <>  
            <div className='timer-container'>
                <p id='timer'>{formatedTime}</p>
            </div>
        </>
    );
}

export default Timer;