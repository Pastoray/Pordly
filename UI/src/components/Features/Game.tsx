import Wpm from './Wpm';
import Timer from './Times';
import { GameOver, restart, handleInput, initData, updateParagraph } from '../../utils/Index';
import { useEffect, useRef, useState } from 'react';
import { ParagraphData, GameProps } from '../../types/Index';
import LoadingScreen from '../UI/LoadingScreen';
import '../../styles/components/Game.scss'
import Accuracy from './Accuracy';

function Game({ missionType, mission, sentences, timer, reqTime, reqWpm, reqAccuracy }: GameProps) {
    const [input, setInput] = useState('');
    const [paragraphData, setParagraphData] = useState<ParagraphData | null>(null);
    const [accuracy, setAccuracy] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [timePassed, setTimePassed] = useState(0.016);
    const [maxTime, setMaxTime] = useState(reqTime ? reqTime : 0);
    const [correctWords, setCorrectWords] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [wordIdx, setWordIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [cooldown, setCooldown] = useState(Date.now());
    const [bonus, setBonus] = useState(0);
    const [luckyIdx, setLuckyIdx] = useState(-1);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        initData(sentences, setParagraphData, setLuckyIdx, setLoading);
    }, [])

    useEffect(() => {
        updateParagraph(paragraphData, setParagraphData, wordIdx, setWordIdx, setLuckyIdx, setGameFinished, inputRef);
    }, [wordIdx])
    
    useEffect(() => {
        inputRef.current!.focus()
    }, [loading])
    useEffect(() => {
        if (timer && maxTime == 0) {
            GameOver(setGameOver, setInput, inputRef)
            return;
        }
        if (gameOver || gameFinished || loading) return;
        const intervalId = setInterval(() => {
            setTimePassed((t) => t + 0.016);
            updateWPM();
            if (timer) {
                setMaxTime((t) => t - 1);
            }
        }, 1000)
        return () => {
            clearInterval(intervalId)
        }
    }, [timePassed, maxTime, loading])
    function updateWPM() {
        setWpm(correctWords / timePassed);
    }

    useEffect(() => {
        setMaxTime((t) => t + bonus)
    }, [bonus])

    function SetMissionAsDone(missionType: string) {
        const v = missionType
        return v;
    }

    return(
        <div className='game-container'>
            <div className='game'>
                <div id='game-timer-container'>
                    <div id='game-stats-container'>
                        <Accuracy accuracy={accuracy}/>
                        <Wpm wpm={wpm}/>
                    </div>
                    {timer ?
                    <Timer time={maxTime}/>
                    :
                    null
                    }
                </div>
                <div className='game-paragraph'>
                    <div className='game-words'>
                        {loading ?
                        <LoadingScreen/>
                        :
                        !gameFinished ?
                            !gameOver ?
                                paragraphData!.words.map((word, idx) => (
                                    idx === wordIdx ? <div key={`div 1 ${idx}`}>
                                                        <span key={idx} id={idx.toString()} className={`current-word ${paragraphData!.classes[idx]} ${idx === luckyIdx ? 'game-rare-word' : ''}`}>{word}</span>
                                                        <span key={`span 1 ${idx}`}>{"\u00A0"}</span>
                                                    </div> 
                                                        : 
                                                    <div key={`div 2 ${idx}`}>
                                                        <span key={idx} id={idx.toString()} className={`${paragraphData!.classes[idx]} ${idx === luckyIdx ? 'game-rare-word' : ''}`}>{word}</span>
                                                        <span key={`span 2 ${idx}`}>{"\u00A0"}</span>
                                                    </div>))
                            :
                                <div className='mission-finished-container'>
                                    <p id='mission' className='mission-failed'>MISSION FAILED</p>
                                    <div>
                                        <p>Total Accuracy: <span className={accuracy >= reqAccuracy ? `mission-succeeded` : `mission-failed`}>{accuracy.toFixed(2)}%</span></p>
                                        <p>Words per minute: <span className={wpm >= reqWpm ? `mission-succeeded` : `mission-failed`}>{wpm.toFixed(2)}</span></p>
                                        { timer ? <p>Time left: <span className={maxTime > 0 ? `mission-succeeded` : `mission-failed`}>{maxTime}s</span></p> : null }
                                    </div>
                                    <button onClick={() => {
                                        restart(setLoading, setBonus, setWordIdx, setParagraphData, setGameOver, setAccuracy, setGameFinished, inputRef)
                                        setTimePassed(0.016);
                                        setCorrectWords(0);
                                        setMaxTime(reqTime ? reqTime : 0);
                                        inputRef.current!.focus();
                                    }}>Restart</button>
                                </div>
                        :   
                            <div className='mission-finished-container'>
                                <p id='mission' className={(accuracy >= reqAccuracy && wpm >= reqWpm && (maxTime? maxTime > 0 : true)) ? 'mission-succeeded' : 'mission-failed'}>MISSION {(accuracy >= reqAccuracy && wpm >= reqWpm && maxTime >= 0) ? 'SUCCESSFUL' : 'FAILED'}</p>
                                <div>
                                    <p>Total Accuracy: <span className={accuracy >= reqAccuracy ? `mission-succeeded` : `mission-failed`}>{accuracy.toFixed(2)}% {accuracy >= reqAccuracy ? <span> {`> ${reqAccuracy}`}</span> : <span>{`< ${reqAccuracy}`}</span>}%</span></p>
                                    <p>Words per minute: <span className={wpm >= reqWpm ? `mission-succeeded` : `mission-failed`}>{wpm.toFixed(2)} {wpm >= reqWpm ? <span> {`> ${reqWpm}`}</span> : <span>{`< ${reqWpm}`}</span>}</span></p>
                                    { timer ? <p>Time left: <span className={maxTime > 0 ? `mission-succeeded` : `mission-failed`}>{maxTime}s</span></p> : null }
                                </div>
                                <button onClick={() => {
                                    restart(setLoading, setBonus, setWordIdx, setParagraphData, setGameOver, setAccuracy, setGameFinished, inputRef);
                                    setTimePassed(0.016);
                                    setCorrectWords(0);
                                    setMaxTime(reqTime ? reqTime : 0);
                                    inputRef.current!.focus();
                                    }}>Replay</button>
                            </div>  
                        }
                    </div>
                </div>
                <div className='game-input'>
                    <input id='input' ref={inputRef} value={input} onChange={(event) => handleInput(event, paragraphData, input, setInput, wordIdx, setWordIdx, cooldown, setCooldown, luckyIdx, setLuckyIdx, setBonus, setAccuracy, setCorrectWords)}/>
                </div>
            </div>
        </div>

    );

}

export default Game;