import StoryQuestsLayout from "../components/UI/StoryQuestsLayout";
import Toolbar from "../components/UI/Toolbar";
import "../styles/pages/LeaderBoards.scss"

function LeaderBoards() {
    return(
        <>
            {/*<div className="leaderboards-container">
                <Toolbar/>
                <div className="leaderboards">
                    <div className="leaderboards-participant">

                    </div>
                </div>
            </div>*/}
            <div className='levels-container'>
                <div>
                    <Toolbar/>
                </div>
                <div className='layout'>
                    <StoryQuestsLayout/>
                </div>
            </div>
        </>
    );
}

export default LeaderBoards;