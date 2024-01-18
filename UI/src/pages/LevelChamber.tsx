//import { useParams } from "react-router-dom";
import Game from "../components/Features/Game";
import Toolbar from "../components/UI/Toolbar";
import '../styles/pages/LevelChamber.scss'

function LevelChamber() {
    //const { lvl } = useParams();
    //const level = parseInt(lvl!);

    return(
        <>
            <div className="chamber-game">
                <Toolbar></Toolbar>
                <Game></Game>
            </div>
        </>
    );
}

export default LevelChamber;