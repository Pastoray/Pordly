import Timer from './Times';
import fetchParagraph from '../../data/fetchParagraph';
import { useEffect, useState } from 'react';
import '../../styles/components/Game.scss'

type ParagraphData = {
    paragraphs: string[],
    curr: string,
    words: string[],
    classes: string[],
    paragraphIdx: number
}

type GameProps = {
    timer: boolean,
    time: number
}

function Game({ timer, time }: GameProps) {
    const [input, setInput] = useState('');
    const [paragraphData, setParagraphData] = useState<ParagraphData | null>(null);
    const [wordIdx, setWordIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [cooldown, setCooldown] = useState(Date.now());
    const [bonus, setBonus] = useState(0); 
    useEffect(() => {
        async function fetchData() {
            const data = await fetchParagraph(10, 10);
            const array = data[0].split('. ');
            array.pop();
            setParagraphData({paragraphs: array,
                             curr: array[0],
                             words: array[0].split(' '),
                             classes: Array.from({ length: array[0].split(' ').length }, () => ''),
                             paragraphIdx: 1} as ParagraphData);
            setLoading(false);
        }
        fetchData()
    }, [])

    useEffect(() => {
        async function updateParagraph() {
            if (paragraphData !== null && wordIdx >= paragraphData!.words.length) {
                const inputElement = document.getElementById('input') as HTMLInputElement;
                inputElement!.readOnly = true;
                await new Promise(resolve => setTimeout(resolve, 1000));
                inputElement!.readOnly = false;
                setWordIdx(0);
                setParagraphData((prev) => ({ ...prev!,
                                                curr: prev!.paragraphs[prev!.paragraphIdx + 1],
                                                words: prev!.paragraphs[prev!.paragraphIdx + 1].split(' '),
                                                classes: Array.from({ length: prev!.paragraphs[prev!.paragraphIdx + 1].split(' ').length }, () => ''),
                                                paragraphIdx: prev!.paragraphIdx + 1
                                            } as ParagraphData))
            }
        }
        updateParagraph()
    }, [wordIdx])

    function addClass(input: String, word: String) {
        if (input === word) {
            setBonus(5);
            paragraphData!.classes[wordIdx] = 'correct'
        } else {
            setBonus(0);
            paragraphData!.classes[wordIdx] = 'wrong'
        }
    }

    function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.value.endsWith(' ')) {
            if (Date.now() - cooldown > 50) {
                setCooldown(Date.now())
                addClass(input, paragraphData!.words[wordIdx]);
                setInput('');
                setWordIdx((idx) => idx + 1);
            }
        } else {
            setInput(event.target.value);
        }
    }

    function GameOver() {
        const inputElement = document.getElementById('input') as HTMLInputElement;
        inputElement!.readOnly = true;
        setGameOver(true);
        setInput('');

    }

    function restart() {
        const inputElement = document.getElementById('input') as HTMLInputElement;
        inputElement!.readOnly = false;
        setLoading(true);

        setBonus(0);
        setWordIdx(100000);

        setParagraphData((prevData) => ({ ...prevData!, paragraphIdx: -1 }));
        noLongerLoading()
    }

    async function noLongerLoading() {
        setTimeout(() => {
            setLoading(false);
            setGameOver(false);
        }, 1000);
    }
    return(
        <div className='game-container'>
            <div className='game'>
                <div id='game-timer-container'>
                    {timer ?
                    <Timer time={time} bonus={bonus} loading= {loading} gameOver={GameOver}/>
                    :
                    null
                    }
                </div>
                <div className='game-paragraph'>
                    <div className='game-words'>
                        {loading ?
                        <div className='game-starting'>
                         <span>S</span>
                         <span>t</span>
                         <span>a</span>
                         <span>r</span>
                         <span>t</span>
                         <span>i</span>
                         <span>n</span>
                         <span>g</span>
                         <span>.</span>
                         <span>.</span>
                         <span>.</span>
                        </div>
                        :
                        !gameOver ?
                          paragraphData!.words.map((word, idx) => (
                            idx === wordIdx ? <div key={`div 1 ${idx}`}>
                                                <span key={idx} id={idx.toString()} className={`current-word ${paragraphData!.classes[idx]}`}>{word}</span>
                                                <span key={`span 1 ${idx}`}>{"\u00A0"}</span>
                                            </div> 
                                            : 
                                            <div key={`div 2 ${idx}`}>
                                                <span key={idx} id={idx.toString()} className={`${paragraphData!.classes[idx]}`}>{word}</span>
                                                <span key={`span 2 ${idx}`}>{"\u00A0"}</span>
                                            </div>))
                        :
                            <div className='gameover-container'>
                                <p>GAME OVER</p>
                                <button onClick={restart}>Restart</button>
                            </div>
                        }
                    </div>
                </div>
                <div className='game-input'>
                    <input id='input' value={input} onChange={handleInput}/>
                </div>
            </div>
        </div>

    );

}

export default Game;