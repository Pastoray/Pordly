import { MutableRefObject, useEffect, useState } from 'react';
import '../../styles/components/Timer.scss'

type TimerProps = {
    time: number,
    bonus: number,
    loading: boolean,
    gameOver: () => void
}

function Timer({ time = 360, bonus = 0, loading = true, gameOver }: TimerProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [timerValue, setTimerValue] = useState(5);
    const [formatedTime, setFormatedTime] = useState(`${Math.floor(time / 60).toString().padStart(2, '0')}
                                                     :${(time % 60).toString().padStart(2, '0')}`) 

    useEffect(() => {
        if (!loading) {
            setTimerValue(5);
            setIsRunning(true);
        } else {
            setIsRunning(false)
        }
    }, [loading])                                
    useEffect(() => {
        if (isRunning && timerValue > 0) {
            const intervalId = setInterval(() => {
                setTimerValue((time) => time - 1)
            }, 1000);
            return () => {
                clearInterval(intervalId);
            }
        } else if (timerValue == 0) {
            gameOver()
        }
    }, [isRunning, timerValue])
    
    useEffect(() => {
        const minutes = (Math.floor(timerValue / 60)).toString().padStart(2, '0')
        const seconds = (timerValue % 60).toString().padStart(2, '0')
        const formattedTime = `${minutes}:${seconds}`
        setFormatedTime(formattedTime);
    }, [timerValue]);

    useEffect(() => {
        setTimerValue((time) => time + bonus)
    }, [bonus])
    return(
        <>  
            <div className='timer-container' onClick={() => setIsRunning(!isRunning)}>
                <p id='timer'>{formatedTime}</p>
            </div>
        </>
    );
}

export default Timer;