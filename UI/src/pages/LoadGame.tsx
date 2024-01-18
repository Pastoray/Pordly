import Game from '../components/Features/Game'
import Toolbar from '../components/UI/Toolbar'
import '../styles/pages/LoadGame.scss'

type LoadGameProps = {
    paragraphs: number,
    sentences: number,
    random: boolean
} & { timer: true, time: number} | { timer: false }

function LoadGame({ paragraphs, sentences, timer, time, random }: LoadGameProps) {
    return(
        <>  <div className='loadgame-container'>
                <Toolbar/>
                <Game timer={timer} time={time}/>
            </div>
        </>
    );
}

export default LoadGame;