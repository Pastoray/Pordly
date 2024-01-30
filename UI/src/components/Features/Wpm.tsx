import { WpmProps } from '../../types/Index';
import '../../styles/components/Wpm.scss'

function Wpm({ wpm }: WpmProps) {
    return(
        <>
            <div className="wpm-container">
                <p>WPM: {Math.ceil(wpm)}</p>
            </div>
        </>
    );
}

export default Wpm;