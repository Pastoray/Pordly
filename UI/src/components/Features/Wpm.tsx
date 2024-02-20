import { WpmProps } from '../../types/Index';
import '../../styles/components/Wpm.scss'

function Wpm({ text, wpm }: WpmProps) {
    return(
        <>
            <div className="wpm-container">
                <p>{text}: {Math.ceil(wpm)}</p>
            </div>
        </>
    );
}

export default Wpm;