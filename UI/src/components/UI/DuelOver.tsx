import { GameStats } from "../../types/Index"

function DuelOver({ userStats, opponentStats }: { userStats: GameStats, opponentStats: GameStats }) {
    
    const winner = determine_winner(userStats, opponentStats)

    function determine_winner(user: GameStats, opponent: GameStats) {
        const user_points = user.accuracy * 10 + user.wpm * 5 
        const opponent_points = opponent.accuracy * 10 + opponent.wpm * 5
        return user_points > opponent_points
    }

    return(
        <>
            <div className='mission-finished-container'>
                <p id='mission' className={winner ? "mission-succeeded" : "mission-failed"}>YOU {winner ? "WON" : "LOST"}</p>
                <div className="mission-results">
                    <div>
                        <p>Your Total Accuracy → <span className={`mission-succeeded`}>{userStats.accuracy.toFixed(2)}%</span></p>
                        <p>Your Words per minute → <span className={`mission-succeeded`}>{Math.ceil(userStats.wpm)}</span></p>
                    </div>
                    <div>
                        <p>Opponent Accuracy → <span className={`mission-failed`}>{opponentStats.accuracy.toFixed(2)}%</span></p>
                        <p>Opponent's Words per minute → <span className={`mission-failed`}>{Math.ceil(opponentStats.wpm)}</span></p>
                    </div>
                </div>
                <button onClick={() => window.location.reload()}>Re-queue</button>
            </div>
        </>   
    );
}

export default DuelOver;