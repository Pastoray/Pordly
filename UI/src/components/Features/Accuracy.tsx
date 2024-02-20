import { AccuracyProps } from "../../types/Index";
import '../../styles/components/Accuracy.scss';

function Accuracy({ text, accuracy }: AccuracyProps) {
    return(
        <>
            <div className="accuracy-container">
                <p>{text}: {(parseFloat((accuracy).toFixed(2)))}%</p>
            </div>
        </>
    );
}

export default Accuracy;