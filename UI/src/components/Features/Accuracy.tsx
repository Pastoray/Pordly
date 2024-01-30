import { AccuracyProps } from "../../types/Index";
import '../../styles/components/Accuracy.scss';

function Accuracy({ accuracy }: AccuracyProps) {
    return(
        <>
            <div className="accuracy-container">
                <p>Accuracy: {(parseFloat((accuracy).toFixed(2)))}%</p>
            </div>
        </>
    );
}

export default Accuracy;