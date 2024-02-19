import Wpm from './Wpm';
import Timer from './Times';
import { setGameOver, restart, handleInput, initData, updateParagraph, handleChange } from '../../utils/Index';
import { useEffect, useRef, useState } from 'react';
import { ParagraphData } from '../../types/Index';
import LoadingScreen from '../UI/LoadingScreen';
import '../../styles/components/Game.scss'
import '../../styles/components/DuelGame.scss'
import Accuracy from './Accuracy';
import GameOver from '../UI/GameOver';

function DuelGame() {
    const paras = 1;

    const [input, setInput] = useState('');
    const [paragraphData, setParagraphData] = useState<ParagraphData | null>(null);
    const [accuracy, setAccuracy] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [timePassed, setTimePassed] = useState(0.016);
    const [time, setTime] = useState(180);
    const [correctWords, setCorrectWords] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [wordIdx, setWordIdx] = useState(0);
    const [loading, setLoading] = useState(true);
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
            setGameOver(setGameFinished, setInput, inputRef)
            return;
        }
        if (gameFinished || gameFinished || loading) return;
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

    function reset() {
        restart(setLoading, setBonus, setWordIdx, setParagraphData, setAccuracy, setGameFinished, inputRef)
        setTimePassed(0.016);
        setCorrectWords(0);
        setTime(180);
        inputRef.current!.focus()
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
                        {
                        loading ?
                        <div className='game-loading-screen'>
                            <LoadingScreen/>
                        </div>
                        :
                        !gameFinished ?
                            paragraphData!.words.map((word, idx) => (
                            idx === wordIdx ? 
                                <div key={`div 1 ${idx}`}>
                                    <span key={idx} id={idx.toString()} className={`current-word ${paragraphData!.classes[idx]} ${idx === luckyIdx ? 'game-rare-word' : ''}`}>{word}</span>
                                    <span key={`span 1 ${idx}`}>{"\u00A0"}</span>
                                </div> 
                            : 
                                <div key={`div 2 ${idx}`}>
                                    <span key={idx} id={idx.toString()} className={`${paragraphData!.classes[idx]} ${idx === luckyIdx ? 'game-rare-word' : ''}`}>{word}</span>
                                    <span key={`span 2 ${idx}`}>{"\u00A0"}</span>
                                </div>))
                        :   
                            <GameOver accuracy={accuracy} wpm={wpm} time={time} reset={reset}/>
                        }
                    </div>
                </div>
                <div className='game-input'>
                    <input id='input' ref={inputRef} value={input} onChange={(event) => handleChange(event, setInput)} onKeyUp={(event) => handleInput(event, paragraphData, input, setInput, wordIdx, setWordIdx, cooldown, setCooldown, luckyIdx, setLuckyIdx, setBonus, setAccuracy, setCorrectWords)}/>
                </div>
            </div>
        </div>

    );

}

export default DuelGame;