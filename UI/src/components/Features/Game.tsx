import Wpm from './Wpm';
import Timer from './Times';
import { GameOver, restart, handleInput, initData, updateParagraph } from '../../utils/Index';
import { useContext, useEffect, useRef, useState } from 'react';
import { ParagraphData, GameProps } from '../../types/Index';
import LoadingScreen from '../UI/LoadingScreen';
import '../../styles/components/Game.scss'
import Accuracy from './Accuracy';
import { DailyQuestsContext } from '../../context/DailyQuestsContext';

function Game({ quest_type, quest_id }: GameProps) {
    const daily_quests = useContext(DailyQuestsContext)
    const quest = daily_quests!.filter((quest) => quest_id === quest.daily_quest_id)[0];
    const paras = 50;

    const [input, setInput] = useState('');
    const [paragraphData, setParagraphData] = useState<ParagraphData | null>(null);
    const [accuracy, setAccuracy] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [timePassed, setTimePassed] = useState(0.016);
    const [time, setTime] = useState(quest.requirements.time);
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
        initData(paras, setParagraphData, setLuckyIdx, setLoading);
    }, [])

    useEffect(() => {
        updateParagraph(paragraphData, setParagraphData, wordIdx, setWordIdx, setLuckyIdx, setGameFinished, inputRef);
    }, [wordIdx])
    
    useEffect(() => {
        inputRef.current!.focus()
    }, [loading])
    useEffect(() => {
        if (time == 0) {
            GameOver(setGameOver, setInput, inputRef)
            return;
        }
        if (gameOver || gameFinished || loading) return;
        const intervalId = setInterval(() => {
            setTimePassed((t) => t + 0.016);
            updateWPM();
            setTime((t) => t - 1);
        }, 1000)
        return () => {
            clearInterval(intervalId)
        }
    }, [timePassed, time, loading])
    function updateWPM() {
        setWpm(correctWords / timePassed);
    }

    useEffect(() => {
        setTime((t) => t + bonus)
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
                    <Timer time={time}/>
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
                                        <p>Total Accuracy: <span className={accuracy >= quest.requirements.accuracy ? `mission-succeeded` : `mission-failed`}>{accuracy.toFixed(2)}%</span></p>
                                        <p>Words per minute: <span className={wpm >= quest.requirements.wpm ? `mission-succeeded` : `mission-failed`}>{wpm.toFixed(2)}</span></p>
                                        <p>Time left: <span className={time > 0 ? `mission-succeeded` : `mission-failed`}>{time}s</span></p>
                                    </div>
                                    <button onClick={() => {
                                        restart(setLoading, setBonus, setWordIdx, setParagraphData, setGameOver, setAccuracy, setGameFinished, inputRef)
                                        setTimePassed(0.016);
                                        setCorrectWords(0);
                                        setTime(quest.requirements.time);
                                        inputRef.current!.focus();
                                    }}>Restart</button>
                                </div>
                        :   
                            <div className='mission-finished-container'>
                                <p id='mission' className={(accuracy >= quest.requirements.accuracy && wpm >= quest.requirements.wpm && (time? time > 0 : true)) ? 'mission-succeeded' : 'mission-failed'}>MISSION {(accuracy >= quest.requirements.accuracy && wpm >= quest.requirements.wpm && time >= 0) ? 'SUCCESSFUL' : 'FAILED'}</p>
                                <div>
                                    <p>Total Accuracy: <span className={accuracy >= quest.requirements.accuracy ? `mission-succeeded` : `mission-failed`}>{accuracy.toFixed(2)}% {accuracy >= quest.requirements.accuracy ? <span> {`> ${quest.requirements.accuracy}`}</span> : <span>{`< ${quest.requirements.accuracy}`}</span>}%</span></p>
                                    <p>Words per minute: <span className={wpm >= quest.requirements.wpm ? `mission-succeeded` : `mission-failed`}>{wpm.toFixed(2)} {wpm >= quest.requirements.wpm ? <span> {`> ${quest.requirements.wpm}`}</span> : <span>{`< ${quest.requirements.wpm}`}</span>}</span></p>
                                    <p>Time left: <span className={time > 0 ? `mission-succeeded` : `mission-failed`}>{time}s</span></p>
                                </div>
                                <button onClick={() => {
                                    restart(setLoading, setBonus, setWordIdx, setParagraphData, setGameOver, setAccuracy, setGameFinished, inputRef);
                                    setTimePassed(0.016);
                                    setCorrectWords(0);
                                    setTime(quest.requirements.time);
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