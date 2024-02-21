import { useEffect, useRef, useState } from 'react';
import Loading from '../UI/Loading';
import DuelOver from '../UI/DuelOver';
import Timer from './Times';
import Wpm from './Wpm';
import Accuracy from './Accuracy';
import { set_game_over, handle_input, initialize_paragraph_data, update_paragraph, handle_word } from '../../utils/Index';
import { ParagraphData, GameStats } from '../../types/Index';
import '../../styles/components/Game.scss'

function DuelGame({ opponent_stats, update_stats, game_state }: { opponent_stats: GameStats, update_stats: (accuracy: number, wpm: number) => void, game_state: () => void }) {
    const paras = 50;

    const [input, setInput] = useState('');
    const [paragraphData, setParagraphData] = useState<ParagraphData | null>(null);
    const [accuracy, setAccuracy] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [timePassed, setTimePassed] = useState(0.016);
    const [time, setTime] = useState(90);
    const [correctWords, setCorrectWords] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [wordIdx, setWordIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [cooldown, setCooldown] = useState(Date.now());
    const [bonus, setBonus] = useState(0);
    const [luckyIdx, setLuckyIdx] = useState(-1);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        initialize_paragraph_data(paras, setParagraphData, setLuckyIdx, setLoading);
    }, [])

    useEffect(() => {
        update_paragraph(paragraphData, setParagraphData, wordIdx, setWordIdx, setLuckyIdx, setGameFinished, inputRef);
    }, [wordIdx])
    
    useEffect(() => {
        inputRef.current!.focus()
    }, [loading])
    useEffect(() => {
        if (time == 0) {

            set_game_over(setGameFinished, setInput, inputRef)
            return;
        }
        if (gameFinished || gameFinished || loading) return;
        const intervalId = setInterval(() => {
            setTimePassed((t) => t + 0.016);
            updateWPM();
            setTime((t) => t - 1);
            update_stats(accuracy, wpm);
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

    useEffect(() => {
        if (gameFinished) {
            game_state()
        }
    }, [gameFinished])

    useEffect(() => {
        if (time <= 0)
            return;
        const intervalId = setInterval(() => {
            update_stats(accuracy, wpm);
        }, 500)
        return () => {
            clearInterval(intervalId)
        }
    }, [timePassed, time, loading])

    return(
        <div className='game-container'>
            <div className='game'>
                <div id='game-timer-container'>
                    <div id='game-stats-container'>
                        <Accuracy text={"Accuracy"} accuracy={accuracy}/>
                        <Wpm text={"WPM"} wpm={wpm}/>
                        <Accuracy text={"Opponent Accuracy"} accuracy={opponent_stats.accuracy}/>
                        <Wpm text={"Opponent WPM"} wpm={opponent_stats.wpm}/>
                    </div>
                    <Timer time={time}/>
                </div>
                <div className='game-paragraph'>
                    <div className='game-words'>
                        {
                        loading ?
                        <div className='game-loading-screen'>
                            <Loading/>
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
                            <DuelOver userStats={{ accuracy: accuracy, wpm: wpm }} opponentStats={opponent_stats}/>
                        }
                    </div>
                </div>
                <div className='game-input'>
                    <input id='input' ref={inputRef} value={input} onChange={(event) => handle_word(event, setInput)} onKeyUp={(event) => handle_input(event, paragraphData, input, setInput, wordIdx, setWordIdx, cooldown, setCooldown, luckyIdx, setLuckyIdx, setBonus, setAccuracy, setCorrectWords)}/>
                </div>
            </div>
        </div>

    );

}

export default DuelGame;